import { ErrorMessages } from "../../shared";
import { AxiosResponse } from "axios";

export interface EnterpriseApiOptions {
    baseUrl?: string;
    protocol?: "http" | "https";
    /**
     * en-us , tr-tr , etc.
     */
    languagePrefix?: string;
    prefix?: string;
    hostName?: string;
    headers?: Record<string, string>;
    /**
     * {'host1':'endpoint1.com',
     * 'host2':'endpoint2.com'}
     */
    endpoints?: Record<string, string>;
    /**
     * sometimes api returns {data:[{...}]}
     * dataField = 'data'
     */
    dataField?: string;
    createErrorMessagesFunc?: (response: AxiosResponse) => ErrorMessages;
    responseInterceptorFunc?:(response:AxiosResponse) => void;
    authTokenHeaderKey?: string;
}
