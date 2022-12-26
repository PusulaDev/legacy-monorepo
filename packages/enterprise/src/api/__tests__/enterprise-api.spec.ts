import { EnterpriseApi } from "../enterpise-api";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import Axios from "axios";
import { createAxiosMock, mockAxiosCreate } from "../../../__mocks__";

describe("Enterprise Api", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should set headers", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            baseUrl: "test.com",
            headers: {
                "content-type": "application/json",
            },
        });

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "test.com/",
            headers: {
                "content-type": "application/json",
            },
        });

        api.setHeader("x-my-key", "1");

        const axios = api.getAxios();

        expect(axios?.defaults?.headers?.["x-my-key"]).toBe("1");
    });

    it("should initialize axios again with options", () => {
        vi.spyOn(Axios, 'create').mockImplementation(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        const options = {
            baseUrl: "second.com",
            headers: {
                "x-auth-token": "test",
            },
        };

        api.setOptions(options);

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "second.com/",
            headers: {
                "x-auth-token": "test",
            },
        });

        expect(api.getOptions()).toEqual(options);
    });

    it("should create axios ", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            baseUrl: "http://test.com",
        });

        const axios = api.getAxios();
        expect(axios).toBeTruthy();
    });

    it("should ensure last character to be slash", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            baseUrl: "http://test.com",
        });

        api.getAxios();

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "http://test.com/",
        });
    });

    it("should create axios with hostName ", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        new EnterpriseApi({
            hostName: "wololo.com",
        });

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "//wololo.com/",
        });
    });

    it("should create base url from options", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            protocol: "https",
            hostName: "myWebsite.com",
            languagePrefix: "tr-tr",
            prefix: "json",
        });

        api.getAxios();

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "https://myWebsite.com/tr-tr/json/",
        });
    });

    it("should create base url withouth protocol and language prefix", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            hostName: "myWebsite.com",
        });

        api.getAxios();

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "//myWebsite.com/",
        });
    });

    it("it should create base url from endPoints", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        global.window = Object.create(window);
        const url = "localhost:1234";

        Object.defineProperty(window, "location", {
            value: {
                host: url,
            },
        });

        const api = new EnterpriseApi({
            endpoints: {
                "localhost:1234": "test.com",
            },
        });

        api.getAxios();

        expect(Axios.create).toHaveBeenCalledWith({
            baseURL: "//test.com/",
        });
    });

    it("should throw error if hostName and baseUrls is empty", () => {
        try {
            new EnterpriseApi({});
        } catch (e: any) {
            expect(e.message).toBe(
                "hostName , endPoints or baseUrl is required"
            );
        }
    });

    it("should set authToken", () => {
        vi.spyOn(Axios, 'create').mockImplementationOnce(() => mockAxiosCreate());

        const api = new EnterpriseApi({
            baseUrl: "test.com",
            authTokenHeaderKey: "x-auth-token",
        });
        api.setAuthToken("test-auth-token");

        const token = api.getAuthToken();
        const headers = api.getAxios()?.defaults?.headers?.["x-auth-token"];

        expect(token).toBe("test-auth-token");
        expect(headers).toBe("test-auth-token");
    });

    it("should set data field", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
            dataField: "data",
        });

        const dataField = api.dataField;

        expect(dataField).toBe("data");
    });

    it("should call get and delete with query params", () => {
        const axiosCreate = createAxiosMock();

        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        api.get("getData", { id: 1 });
        api.delete("getData", { id: 1 });

        expect(axiosCreate.get).toHaveBeenCalledWith("getData?id=1", undefined);
        expect(axiosCreate.delete).toHaveBeenCalledWith(
            "getData?id=1",
            undefined
        );
    });

    it("should call post and put with data", () => {
        const axiosCreate = createAxiosMock();

        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        api.post("getData", { id: 1 });
        api.put("getData", { id: 1 });

        expect(axiosCreate.post).toHaveBeenCalledWith(
            "getData",
            { id: 1 },
            undefined
        );
        expect(axiosCreate.put).toHaveBeenCalledWith(
            "getData",
            { id: 1 },
            undefined
        );
    });

    it("should send file data", () => {
        const axiosCreate = createAxiosMock();

        const api = new EnterpriseApi({
            baseUrl: "upload.com",
        });

        const files: File[] = [new File([], "")];
        const data = { id: 1 };

        api.upload("up", files as File[], { id: 1 }, "json");

        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i], files[i].name);
        }

        formData.append("json", JSON.stringify(data));

        expect(axiosCreate.post).toHaveBeenCalledWith("up", formData, undefined);
    });
});
