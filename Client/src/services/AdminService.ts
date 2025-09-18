import axios from "axios";
import type { Admin } from "../types/Admin";

export const adminService = {
    async getAdmin(token: string): Promise<Admin> {
        try {
            const response = await axios.get<Admin>("/api/admin/get-admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...response.data };
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to get admin. Please try again.";
                if (typeof err.response?.data === "string") {
                    message = err.response.data;
                }
                else if (typeof err.response?.data?.message === "string") {
                    message = err.response.data.message;
                }
                else {
                    message = JSON.stringify(err.response?.data);
                }
                return { success: false, message };
            }
            return { success: false, message: "Unexpected error occurred" };
        }
    }
}