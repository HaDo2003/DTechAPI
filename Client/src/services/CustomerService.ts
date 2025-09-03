import axios from "axios";
import { type Customer } from "../types/Customer";

export const customerService = {
    async getCustomerProfile(token: string): Promise<Customer> {
        try {
            const response = await axios.get<Customer>("/api/profile/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...response.data, success: true };
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to fetch customer profile. Please try again.";
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