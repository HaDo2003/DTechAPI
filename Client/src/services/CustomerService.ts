import axios from "axios";
import { type Customer, type CustomerProfileForm, type ChangePasswordForm } from "../types/Customer";
import { type MessageResponse } from "../types/MessageReponse";
import { type CustomerAddress, type CustomerAddressResponse } from "../types/CustomerAddress";
import type { Contact } from "../types/Contact";
import type { OrderDetailResponse } from "../types/Order";
import type { ServiceResponse } from "../types/Admin";

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
            return { success: true, message: response.data.message || "Change Password successfully" };
        } catch (err) {
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
    },

    async createAddress(token: string, data: CustomerAddress): Promise<CustomerAddressResponse> {
        try {
            const { addressId, ...dto } = data;
            const response = await axios.post<CustomerAddressResponse>("/api/profile/add-new-address", dto, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                message: response.data.message || "Add new address successfully",
                addressId: response.data.addressId,
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to add new address. Please try again.";
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

    async editAddress(token: string, data: CustomerAddress): Promise<CustomerAddressResponse> {
        try {
            const response = await axios.put<CustomerAddressResponse>("/api/profile/edit-address", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { success: true, message: response.data.message || "Edit address successfully" };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to edit address. Please try again.";
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

    async deleteAddress(token: string, addressId: number | null): Promise<CustomerAddressResponse> {
        try {
            if (addressId === null) {
                return { success: false, message: "Address not exist" };
            }
            const response = await axios.delete<CustomerAddressResponse>(
                `/api/profile/delete-address/${addressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return { success: true, message: response.data.message || "Add new address successfully" };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to add new address. Please try again.";
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

    async sendContact(data: Contact): Promise<MessageResponse> {
        try {
            const response = await axios.post<MessageResponse>("/api/contact/send-contact", data);
            return { success: true, message: response.data.message || "Send Contact successfully" };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to send contact. Please try again.";
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

    async setDefaultAddress(token: string, addressId: number): Promise<CustomerAddressResponse> {
        try {
            const response = await axios.put<CustomerAddressResponse>(`/api/profile/switch-default-address/${addressId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                message: response.data.message || "Change default successfully" ,
                addressId: response.data.addressId
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to change default address. Please try again.";
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

    async getOrderDetail(token: string, orderId: string): Promise<OrderDetailResponse> {
        try {
            const response = await axios.get<Customer>(`/api/profile/get-order-detail/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...response.data, success: true, message: "Fetch order detail successfully" };
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to fetch order detail. Please try again.";
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

    async getWishlists<T>(token: string): Promise<ServiceResponse<T[]>> {
        try {
            const response = await axios.get<T[]>(`/api/profile/get-wishlists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to get wishlists. Please try again.";
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

    async addWishlist(token: string, productId: number): Promise<MessageResponse> {
        try {
            const response = await axios.post<MessageResponse>(`/api/profile/add-wishlist/${productId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                message: response.data.message || "Add wishlist successfully",
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to add new wishlist. Please try again.";
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

    async removeWishlist(token: string, productId: number): Promise<MessageResponse> {
        try {
            const response = await axios.delete<MessageResponse>(`/api/profile/remove-wishlist/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                message: response.data.message || "Remove wishlist successfully",
            };
        }catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Failed to add new wishlist. Please try again.";
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
}