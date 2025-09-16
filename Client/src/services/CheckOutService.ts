import axios from "axios";
import type { CheckOut, CouponResponse, } from "../types/Order";
import type { OrderSuccessModel } from "../types/OrderSuccess";

export const checkOutService = {
    async fetchCheckOut(token: string): Promise<CheckOut> {
        try {
            const res = await axios.get<CheckOut>("/api/checkOut/check-out", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
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

    async applyCoupon(token: string, code: string, buyNow?: { isBuyNow: boolean; productId: number; quantity: number; }): Promise<CouponResponse> {
        try {
            const body = { code, ...buyNow };
            const res = await axios.post<CouponResponse>("/api/checkOut/apply-coupon", body, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data };
        } catch (err) {
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

    async buyNow(token: string, productId: number, quantity: number): Promise<CheckOut> {
        try {
            const res = await axios.post<CheckOut>("/api/checkOut/buy-now", { productId, quantity }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
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

    async placeOrder(token: string, data: CheckOut, isBuyNow?: boolean): Promise<OrderSuccessModel> {
        try {
            const body = { ...data, isBuyNow };
            const res = await axios.post<OrderSuccessModel>("/api/checkOut/place-order", body, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
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
                return { success: false };
            }
            return { success: false };
        }
    },

    async getOrderSuccess(token: string, orderId: string): Promise<OrderSuccessModel> {
        try {
            const res = await axios.get<OrderSuccessModel>(`/api/checkOut/get-order-success/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
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
                return { success: false };
            }
            return { success: false };
        }
    }
}