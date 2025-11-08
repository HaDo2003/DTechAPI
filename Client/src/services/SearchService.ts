import axios from "axios";
import type { SearchProductProps } from "../types/Product";
import { handleAxiosError } from "../utils/handleAxiosError";

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
            return handleAxiosError(err, "Search product failed. Please try again.") as SearchProductProps;
        }
    }
}