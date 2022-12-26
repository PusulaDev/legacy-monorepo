import { EnterpriseDataProvider } from "../enterprise-data-provider";
import { EnterpriseApi, HTTP_SUCCESS_CODES } from "../../api";
import { IApiRequestOptions } from "..";
import { IMockData } from "../../data-house/mocks/mock";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import Axios, { AxiosInstance } from "axios"
import { createAxiosMock } from "../../../__mocks__";



describe("Enterprise Data Provider", () => {
    let provider: EnterpriseDataProvider;
    let axiosCreate: AxiosInstance;

    beforeEach(() => {
        vi.clearAllMocks();

        axiosCreate = createAxiosMock();
        const enterpriseApi = new EnterpriseApi({
            baseUrl: "http://test.com",
        });
        provider = new EnterpriseDataProvider(enterpriseApi);
    });


    it("should return data", async () => {
        const expectedResponse = { data: { id: 1, name: "ali" }, status: HTTP_SUCCESS_CODES[0] };

        (axiosCreate.post as Mock).mockResolvedValue(expectedResponse)

        const response = await provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });

        expect(axiosCreate.post).toHaveBeenCalledWith("patient", { id: 1 }, undefined);
        expect(response.data).toEqual(expectedResponse.data);
    });

    it("should call post with cancelToken", async () => {

        (axiosCreate.post as Mock).mockImplementationOnce(() => { throw new Error() })
            .mockImplementationOnce(() => ({ data: 1, status: HTTP_SUCCESS_CODES[0] }))
        vi.spyOn(Axios, "isCancel").mockImplementation(() => true)

        const request = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
            cancelTokenUniqueKey: "1",
        });

        const request2 = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 2 },
            cancelTokenUniqueKey: "1",
        });

        const result1 = await request;
        const result2 = await request2;


        expect(result1.canceled).toBeTruthy();
        expect(result2.canceled).toBeFalsy();
    });

    it("should not cancel the same second request", async () => {

        (axiosCreate.post as Mock).mockImplementationOnce(() => { throw new Error() })
            .mockImplementationOnce(() => ({ data: 1, status: HTTP_SUCCESS_CODES[0] }))

        vi.spyOn(Axios, "isCancel").mockImplementation(() => true)

        const request = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 23 },
            cancelTokenUniqueKey: "1111",
        });

        const request2 = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 23 },
            cancelTokenUniqueKey: "1111",
        });

        const result1 = await request;
        const result2 = await request2;

        expect(result1.canceled).toBeTruthy();
        expect(result2.canceled).toBeFalsy();
    })

    it("should prevent multiple same request", () => {
        (axiosCreate.post as Mock).mockResolvedValue({ data: 1 })

        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });
        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });
        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });

        expect(axiosCreate.post).toHaveBeenCalledTimes(1);
    });

    it("should create errorMessages when error and createErrorMessagesFunc defined", async () => {
        const api = new EnterpriseApi({
            baseUrl: "http://test.com",
            createErrorMessagesFunc: (response) => {
                return response.data;
            },
        });

        provider = new EnterpriseDataProvider(api);

        const errorMessage = {
            error: "Error message",
        };

        vi.spyOn(axiosCreate, 'post').mockResolvedValueOnce({
            data: errorMessage,
            status: 500,
        })

        const request = provider.apiRequest({
            options: { url: "test" },
            request: {},
        });


        const result = await request;

        expect(result.errorMessages).toEqual(errorMessage);
    });

    it("should validate response", async () => {
        const expectedErrorMessage: Record<string, string> = {
            id: "must bigger then 0",
        };

        const requestOptions: IApiRequestOptions<IMockData> = {
            url: "test",
            responseValidationFn: (result) => {
                if (result?.id)
                    return {
                        valid: true,
                    };

                return {
                    errorMessages: expectedErrorMessage,
                    valid: false,
                };
            },
        };

        const mockData: IMockData = {
            name: "test",
            id: 0,
        };

        vi.spyOn(axiosCreate, 'post').mockResolvedValueOnce({ data: mockData })

        const request = provider.apiRequest<{}, IMockData>({
            options: requestOptions,
            request: {},
        });

        const response = await request;

        expect(response.errorMessages).toEqual(expectedErrorMessage);
    });
});
