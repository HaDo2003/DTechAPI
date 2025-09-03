import axios from "axios";
import { type Customer, type CustomerProfileForm, type ChangePasswordForm } from "../types/Customer";
import { type MessageResponse } from "../types/MessageReponse";

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
    },

    async updateCustomerProfile(token: string, data: CustomerProfileForm): Promise<MessageResponse> {
        try {
            const formData = new FormData();
            formData.append("userName", data.userName);
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("gender", data.gender);
            formData.append("dateOfBirth", data.dateOfBirth);
            formData.append("image", data.image);
            if (data.imageUpload) {
                formData.append("imageUpload", data.imageUpload);
            }

            const response = await axios.put<MessageResponse>("/api/profile/update-profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { success: true, message: response.data.message || "Profile updated successfully" };
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to update customer profile. Please try again.";
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
    },

    async changePassword(token: string, data: ChangePasswordForm): Promise<MessageResponse> {
        try {
            const response = await axios.put<MessageResponse>("/api/profile/change-password", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {success: true, message: response.data.message || "Change Password successfully"};
        } catch(err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to change password. Please try again.";
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