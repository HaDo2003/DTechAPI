import axios from "axios";
import type { Admin, ServiceResponse } from "../types/Admin";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { Dashboard } from "../types/Dashboard";

export const adminService = {
    async getAdmin(token: string): Promise<ServiceResponse<Admin>> {
        try {
            const response = await axios.get<Admin>("/api/dashboard/get-admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { success: true, data: response.data };
        } catch (err: any) {
            return handleAxiosError(err, "Failed to get admin. Please try again.");
        }
    },

    async getSingleData<T>(endpoint: string, token?: string): Promise<ServiceResponse<T>> {
        try {
            const response = await axios.get<ServiceResponse<T>>(endpoint, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to fetch data. Please try again.");
        }
    },

    async getData<T>(endpoint: string, token?: string): Promise<ServiceResponse<T[]>> {
        try {
            const response = await axios.get<T[]>(endpoint, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            return { success: true, data: response.data };
        } catch (err: any) {
            return handleAxiosError(err, "Failed to fetch data. Please try again.");
        }
    },

    async createData<T>(endpoint: string, data: FormData | T, token?: string): Promise<ServiceResponse<T>> {
        try {
            const isFormData = data instanceof FormData;

            const headers: any = {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(!isFormData && { "Content-Type": "application/json" }),
            };

            const response = await axios.post<ServiceResponse<T>>(endpoint, data, { headers });
            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to create data. Please try again.");
        }
    },

    async updateData<T>(
        endpoint: string,
        id: string | number,
        data: T | FormData,
        token?: string
    ): Promise<ServiceResponse<T>> {
        try {
            const isFormData = data instanceof FormData;

            const headers: any = {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(!isFormData && { "Content-Type": "application/json" }),
                ...(isFormData && { "Content-Type": "multipart/form-data" })
            };

            const response = await axios.put<ServiceResponse<T>>(
                `${endpoint}/${id}`,
                data,
                { headers }
            );

            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to update data. Please try again.");
        }
    },

    async updateImageData<T>(
        endpoint: string,
        id: string | number,
        data: T | FormData,
        token?: string
    ): Promise<ServiceResponse<T>> {
        try {
            const isFormData = data instanceof FormData;

            const headers: any = {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(!isFormData && { "Content-Type": "application/json" }),
            };

            const response = await axios.put<ServiceResponse<T>>(
                `${endpoint}/${id}`,
                data,
                { headers }
            );

            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to update image. Please try again.");
        }
    },

    async updateProductModels<T>(
        endpoint: string,
        id: string | number,
        data: T | FormData,
        token?: string
    ): Promise<ServiceResponse<T>> {
        try {
            const isFormData = data instanceof FormData;

            const headers: any = {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(!isFormData && { "Content-Type": "application/json" }),
            };

            const response = await axios.put<ServiceResponse<T>>(
                `${endpoint}/${id}`,
                data,
                { headers }
            );

            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to update image. Please try again.");
        }
    },

    async deleteData(endpoint: string, id: string | number, token?: string): Promise<ServiceResponse<null>> {
        try {
            await axios.delete(`${endpoint}/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return { success: true };
        } catch (err: any) {
            return handleAxiosError(err, "Failed to delete data. Please try again.");
        }
    },

    async getSelectData<T>(endpoint: string, token?: string, typeOfData?: string): Promise<ServiceResponse<T[]>> {
        try {
            const response = await axios.get<T[]>(endpoint, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return { success: true, data: response.data };
        } catch (err: any) {
            return handleAxiosError(err, `Failed to fetch ${typeOfData}. Please try again.`);
        }
    },

    async updateOrderStatus<T>(
        endpoint: string,
        token?: string,
        id?: string,
        newStatus?: string
    ): Promise<ServiceResponse<T>> {
        try {
            const response = await axios.put<ServiceResponse<T>>(
                `${endpoint}/${id}`,
                { statusName: newStatus },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
            );
            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, `Failed to update ${newStatus}. Please try again.`);
        }
    },

    async fecthDashboardData(token?: string): Promise<ServiceResponse<Dashboard>> {
        try {
            const response = await axios.get<ServiceResponse<Dashboard>>("/api/dashboard/fetch-dashboard", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return response.data;
        } catch (err: any) {
            return handleAxiosError(err, "Failed to fetch dashboard data. Please try again.");
        }
    },
}