import axios from "axios";
import type { SearchProductProps } from "../types/Product";

export const searchService = {
    async searchProduct(query: string, sortOrder?: string, token?: string): Promise<SearchProductProps> {
        try {
            const res = await axios.get<SearchProductProps>(
                `/api/product/search?query=${encodeURIComponent(query)}&sortOrder=${sortOrder}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            );
            return { ...res.data, success: true };
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                let message: string = "Search product failed. Please try again.";

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