import { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosProgressEvent } from "axios";
import { EnterpriseApiOptions } from "..";
export interface IEnterpriseApi {
    dataField?: string;

    getAuthToken(): string | undefined;

    setAuthToken(token: string): void;

    get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse>;

    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;

    put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;

    delete(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;

    upload(
        url: string,
        files: File[],
        data?: any,
        dataKey?: string,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<AxiosResponse>;

    getAxios(): AxiosInstance | undefined;

    setOptions(options: EnterpriseApiOptions): void;

    getOptions(): EnterpriseApiOptions;

    setHeader(key: string, value: string): void;
}
