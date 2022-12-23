import { EnterpriseApiOptions } from "./types/enterprise-api.options";
import cloneDeep from "lodash.clonedeep";
import axios, { AxiosInstance, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from "axios";
import { EnterpriseApiHelper } from "./enterprise-api.helper";
import { IEnterpriseApi } from "./types/enterprise.api.interface";

export class EnterpriseApi implements IEnterpriseApi {
    private options: EnterpriseApiOptions;
    private axios?: AxiosInstance;
    private authToken?: string;

    constructor(options: EnterpriseApiOptions) {
        this.options = options;
        this.initAxios(options);
    }

    private initAxios(options: EnterpriseApiOptions) {
        this.axios = axios.create({
            baseURL: EnterpriseApiHelper.createBaseUrl(options),
            headers: options.headers,
        });
    }

    get dataField() {
        return this.options.dataField;
    }

    getAuthToken() {
        return this.authToken;
    }

    setAuthToken(token: string) {
        this.authToken = token;
        if (this.options.authTokenHeaderKey) this.setHeader(this.options.authTokenHeaderKey, token);
    }

    /**
     * converts data to querystring and appends to url
     * @param data should only contain one level nested values
     */
    async get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (!this.axios) throw new Error("axios is not initialized");

        if (data) {
            url = EnterpriseApiHelper.createUrl(url, data);
        }

        const res = await this.axios.get(url, config);
        this.options.responseInterceptorFunc?.(res);
        return res;
    }

    async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (!this.axios) throw new Error("axios is not initialized");

        const res = await this.axios.post(url, data, config);
        this.options.responseInterceptorFunc?.(res);
        return res;
    }

    async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (!this.axios) throw new Error("axios is not initialized");

        const res = await this.axios.put(url, data, config);
        this.options.responseInterceptorFunc?.(res);
        return res;
    }

    async delete(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        if (!this.axios) throw new Error("axios is not initialized");

        if (data) {
            url = EnterpriseApiHelper.createUrl(url, data);
        }
        const res = await this.axios.delete(url, config);
        this.options.responseInterceptorFunc?.(res);
        return res;
    }

    async upload(
        url: string,
        files: File[],
        data?: any,
        dataKey?: string,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<AxiosResponse> {
        if (!this.axios) throw new Error("axios is not initialized");

        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i], files[i].name);
        }

        formData.append(dataKey ?? "data", JSON.stringify(data));

        const config = onUploadProgress ? { onUploadProgress } : undefined;

        const res = await this.axios.post(url, formData, config);
        this.options.responseInterceptorFunc?.(res);
        return res;
    }

    getAxios(): AxiosInstance | undefined {
        return this.axios;
    }

    setOptions(options: EnterpriseApiOptions): void {
        this.options = options;
        this.initAxios(options);
    }

    getOptions(): EnterpriseApiOptions {
        return cloneDeep(this.options);
    }

    setHeader(key: string, value: string) {
        if (!this.axios) throw new Error("axios is not initialized");

        this.axios.defaults.headers[key] = value;
    }
}
