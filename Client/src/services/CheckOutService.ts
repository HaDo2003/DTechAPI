import axios from "axios";
import type { CheckOut, CouponResponse, } from "../types/Order";
import type { OrderSuccessModel } from "../types/OrderSuccess";
import { handleAxiosError } from "../utils/handleAxiosError";

export const checkOutService = {
    async fetchCheckOut(token: string): Promise<CheckOut> {
        try {
            const res = await axios.get<CheckOut>("/api/checkOut/check-out", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
            return handleAxiosError(err, "Failed to fetch checkout information. Please try again.") as CheckOut;
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
            return handleAxiosError(err, "Failed to apply coupon. Please try again.");
        }
    },

    async buyNow(token: string, productId: number, quantity: number, colorId: number): Promise<CheckOut> {
        try {
            const res = await axios.post<CheckOut>("/api/checkOut/buy-now", { productId, quantity, colorId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
            return handleAxiosError(err, "Failed to process buy now. Please try again.") as CheckOut;
        }
    },

    async placeOrder(token: string, data: CheckOut, isBuyNow?: boolean): Promise<OrderSuccessModel> {
        try {
            const body = {...data, isBuyNow};
            const res = await axios.post<OrderSuccessModel>("/api/checkOut/place-order", body , {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
            return handleAxiosError(err, "Failed to place order. Please try again.");
        }
    },

    async orderSuccessData(token: string, orderId: string): Promise<OrderSuccessModel> {
        try {
            const res = await axios.get<OrderSuccessModel>(`/api/checkOut/order-success/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { ...res.data, success: true };
        } catch (err) {
            return handleAxiosError(err, "Failed to fetch order success data. Please try again.");
        }
    }
}