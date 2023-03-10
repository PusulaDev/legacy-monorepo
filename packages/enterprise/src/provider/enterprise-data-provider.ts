import { IApiRequestValidationResult } from "./types/api-request-validation-result.interface";
import { IApiRequestOptions } from "./types/api-request-options.interface";
import { validateRequest } from "../api/enterprise-api-validator";
import Axios, { AxiosResponse, AxiosPromise, AxiosError, AxiosProgressEvent } from "axios";
import { IApiResponse } from "./types/api-response.interface";
import { HTTP_SUCCESS_CODES } from "../api/enterprise-api.const";
import { EnumRequestMethod } from "../api/enums/request-method.enum";
import { ICancellableApiResponse } from "./types/cancellable-api-response.interface";
import { EnterpriseApiHelper } from "../api/enterprise-api.helper";
import { IEnterpriseRequestOptions } from "./types/enterprise-request-options.interface";
import { EnterpriseCancellable } from "./enterprise-cancellable";
import { IEnterpriseApi } from "../api";
import { IApiRequestParams } from "./types/api-request-params.interface";
import cloneDeep from "lodash.clonedeep";
import { IEnterpriseDataProvider } from "./types/enterprise-data-provider.interface";

export class EnterpriseDataProvider extends EnterpriseCancellable implements IEnterpriseDataProvider {
    protected api: IEnterpriseApi;
    protected waitingRequests: Map<string, AxiosPromise>;

    constructor(api: IEnterpriseApi) {
        super();
        this.api = api;
        this.waitingRequests = new Map();
    }

    get initialized() {
        return !!this.api;
    }

    protected initWaitingRequests() {
        this.waitingRequests = new Map();
        this.cancelTokens = new Map();
    }

    protected deleteWaitingRequests(key: string) {
        this.waitingRequests.delete(key);
    }

    protected addWaitingRequest(key: string, request: AxiosPromise<any>) {
        this.waitingRequests.set(key, request);
    }

    protected createRequest(options: IEnterpriseRequestOptions): AxiosPromise {
        switch (options.method) {
            case EnumRequestMethod.GET:
                return this.api.get(options.url, options.data, options.config);
            case EnumRequestMethod.PUT:
                return this.api.put(options.url, options.data, options.config);
            case EnumRequestMethod.DELETE:
                return this.api.delete(options.url, options.data, options.config);
            default:
                return this.api.post(options.url, options.data, options.config);
        }
    }


    protected async createResponse(options: IEnterpriseRequestOptions): Promise<AxiosResponse> {
        let mustCheckWaitingRequest = options.mustCheckWaitingRequest ?? true;

        let response: AxiosResponse<any>;

        const waitingRequestKey = EnterpriseApiHelper.createUniqueKey(
            options.url,
            options.data,
            options.method
        );

        try {
            if (mustCheckWaitingRequest) {
                response = await this.checkWaitingRequests(waitingRequestKey, options);
            } else {
                response = await this.createNewRequest(waitingRequestKey, options);
            }
        } catch (e) {
            this.deleteWaitingRequests(waitingRequestKey);
            throw e;
        }
       

        this.deleteWaitingRequests(waitingRequestKey);
        return response;
    }

    protected async checkWaitingRequests(
        waitingRequestKey: string,
        options: IEnterpriseRequestOptions
    ): Promise<AxiosResponse> {
        let response: AxiosResponse<any>;

        const waitingRequest = this.waitingRequests.get(waitingRequestKey);
        if (waitingRequest) {
            response = await this.handleWaitingRequests(waitingRequest, waitingRequestKey, options);
            response = cloneDeep(response);
        } else {
            response = await this.createNewRequest(waitingRequestKey, options);
        }

        return response;
    }


    /**
     * If waiting request is canceled, new request is created anyway
     */
    protected async handleWaitingRequests(
        waitingRequest: AxiosPromise,
        key: string,
        options: IEnterpriseRequestOptions
    ): Promise<AxiosResponse> {
        let response: AxiosResponse<any>;

        try {
            response = await waitingRequest;
        } catch (e: any) {
            const result = this.handleBaseRequestError(e);
            this.deleteWaitingRequests(key);
            if (result.canceled) {
                response = await this.createNewRequest(key, options);
            } else throw e;
        }

        return response;
    }


    protected createNewRequest(waitingRequestKey: string, options: IEnterpriseRequestOptions) {
        const request = this.createRequest(options);
        this.addWaitingRequest(waitingRequestKey, request);
        return request;
    }

    protected async baseRequest<TResponseModel>(
        options: IEnterpriseRequestOptions
    ): Promise<IApiResponse<TResponseModel>> {
        try {
            const response = await this.createResponse(options);

            return this.createResult(response);
        } catch (e: any) {
            const waitingRequestKey = EnterpriseApiHelper.createUniqueKey(
                options.url,
                options.data,
                options.method
            );
            this.deleteWaitingRequests(waitingRequestKey);
            return this.handleBaseRequestError(e);
        }
    }

    protected handleBaseRequestError<TResponseModel>(e: AxiosError): IApiResponse<TResponseModel> {
        const error = e as AxiosError;

        if (Axios.isCancel(e)) {
            return { canceled: true };
        }

        const createErrorMessagesFunc = this.api.getOptions().createErrorMessagesFunc;

        if (error.response && createErrorMessagesFunc) {
            return {
                errorMessages: createErrorMessagesFunc(error.response),
            };
        }

        return {
            errorMessages: { [error.name]: error.message },
        };
    }

    protected createResult<TResponseModel>(response: AxiosResponse<any>): IApiResponse<TResponseModel> {
        const data = this.api.dataField ? response.data[this.api.dataField] : response.data;

        const isSuccess = HTTP_SUCCESS_CODES.includes(response.status);

        if (isSuccess)
            return {
                data: data as TResponseModel,
            };

        return this.createNotSuccessResult(response, data);
    }

    protected createNotSuccessResult<TResponseModel>(
        response: AxiosResponse<any>,
        data: any
    ): IApiResponse<TResponseModel> {
        const createErrorMessagesFunc = this.api.getOptions().createErrorMessagesFunc;

        if (response && createErrorMessagesFunc) {
            return {
                errorMessages: createErrorMessagesFunc(response),
            };
        }

        return {
            errorMessages: { "server error": data },
        };
    }

    /**
     * override for extra validation. Dont forget to call super()
     */
    protected validateRequest<TRequest, TResponse>(
        requestOptions: IApiRequestOptions<TResponse>,
        request: TRequest
    ): IApiRequestValidationResult {
        if (!requestOptions.validationRules)
            return {
                valid: true,
            };

        return validateRequest(requestOptions.validationRules, request);
    }

    protected validateResponse<TResponse = undefined>(
        requestOptions: IApiRequestOptions<TResponse>,
        response?: TResponse
    ): IApiRequestValidationResult {
        if (!requestOptions.responseValidationFn)
            return {
                valid: true,
            };

        return requestOptions.responseValidationFn(response);
    }

    /**
     * Returns cancel token and response.
     */
    cancellableApiRequest<TRequest, TResponse = undefined>(
        options: IApiRequestOptions<TResponse>,
        request: TRequest,
        mustCheckWaitingRequest: boolean = true
    ): ICancellableApiResponse<TResponse> {
        const source = EnterpriseApiHelper.createCancelToken();

        const response = this.apiRequest<TRequest, TResponse>({
            options,
            request,
            mustCheckWaitingRequest,
            config: { cancelToken: source.token },
        });

        return { response, token: source };
    }

    /**
     * Validates request, handles cancelation and response
     * @param cancelTokenUniqueKey Unique string for grouping sameRequest. Cancels existing waiting promises with same unique key and request.
     * @param mustCheckWaitingRequest Prevents paralel same request
     */
    async apiRequest<TRequest, TResponse>(
        params: IApiRequestParams<TRequest, TResponse>
    ): Promise<IApiResponse<TResponse>> {
        let { options, request, cancelTokenUniqueKey, mustCheckWaitingRequest = true, config } = cloneDeep(
            params
        );

        const validationResult = this.validateRequest(options, request);

        if (!validationResult.valid) {
            return {
                errorMessages: validationResult.errorMessages,
            };
        }

        if (cancelTokenUniqueKey) {
            if (!config) config = {};
            const source = this.handleCancelation(options, cancelTokenUniqueKey);
            config.cancelToken = source.token;
        }

        let response = await this.baseRequest<TResponse>({
            url: options.url,
            data: request,
            config,
            method: options.method,
            mustCheckWaitingRequest,
        });

        const responseValidationResult = this.validateResponse<TResponse>(options, response.data);

        if (!responseValidationResult.valid) {
            response.errorMessages = responseValidationResult.errorMessages;
        }

        if (cancelTokenUniqueKey) {
            this.deleteCancelTokens(options, cancelTokenUniqueKey);
        }

        return response;
    }

    fileUpload(
        options: IEnterpriseRequestOptions,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<AxiosResponse<any>> {
        if (!options.files?.length) throw new Error("files must not be empty");

        return this.api.upload(
            options.url,
            options.files,
            options.data,
            options.dataKeyOnFileUpload,
            onUploadProgress
        );
    }
}
