import axios from "axios";
import type { MessageResponse } from "../types/MessageReponse";
import type { CartProduct } from "../types/CartProduct";
import type { Cart } from "../types/Cart";

export const cartService = {
    async addToCart(token: string, data: CartProduct): Promise<MessageResponse> {
        try {
            const res = await axios.post<MessageResponse>("/api/cart/add-to-cart", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return { success: true, message: res.data.message || "Add to cart successfully" };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Add to cart failed. Please try again.";
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

    async getCart(token: string): Promise<Cart> {
        try {
            const res = await axios.get<Cart>("/api/cart/get-cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return { ...res.data, success: true, message: res.data.message };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Get cart failed. Please try again.";
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

    async updateProductQuantity(token: string, id: number, change: number): Promise<Cart> {
        try {
            const res = await axios.put<Cart>(`/api/cart/update-quantity/${id}`,
            { change },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return { ...res.data, success: true, message: res.data.message };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let message: string = "Update quantity failed. Please try again.";
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