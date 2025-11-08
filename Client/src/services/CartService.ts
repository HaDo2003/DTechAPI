import axios from "axios";
import type { MessageResponse } from "../types/MessageReponse";
import type { CartProduct } from "../types/CartProduct";
import type { Cart } from "../types/Cart";
import { handleAxiosError } from "../utils/handleAxiosError";

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
            const errorResponse = handleAxiosError(err, "Add to cart failed. Please try again.");
            return { success: errorResponse.success, message: errorResponse.message || "Add to cart failed. Please try again." };
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
            const errorResponse = handleAxiosError(err, "Get cart failed. Please try again.");
            return { ...errorResponse, message: errorResponse.message || "Get cart failed. Please try again." };
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
            const errorResponse = handleAxiosError(err, "Update quantity failed. Please try again.");
            return { ...errorResponse, message: errorResponse.message || "Update quantity failed. Please try again." };
        }
    }
}