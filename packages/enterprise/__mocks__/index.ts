import Axios, { AxiosInstance, Cancel } from "axios";
import { vi } from "vitest";

export const mockAxiosCreate = () => ({
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    defaults: {
        headers: {}
    },
    interceptors: {
        request: { clear: vi.fn(), eject: vi.fn(), use: vi.fn() },
        response: { clear: vi.fn(), eject: vi.fn(), use: vi.fn() }
    },
    getUri: vi.fn(),
    request: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    patch: vi.fn(),
    postForm: vi.fn(),
    putForm: vi.fn(),
    patchForm: vi.fn()
} as unknown as AxiosInstance)

export const createAxiosMock = () => {
    const axiosCreate = mockAxiosCreate();
    vi.spyOn(Axios, 'create').mockImplementation(() => axiosCreate);
    return axiosCreate;
}