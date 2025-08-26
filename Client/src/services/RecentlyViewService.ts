import axios from "axios";
import { type Product } from "../types/Product";
import { getRecentlyViewed } from "../utils/recentlyViewed";

export const getRecentlyViewProductData = async (): Promise<Product[]> => {
    const productIds = getRecentlyViewed();

    if (!productIds || productIds.length === 0) {
        return [];
    }

    const idsParam = productIds.join(",");
    const res = await axios.get<Product[]>(`/api/product/recentlyView`, {
        params: { ids: idsParam },
    });

    return res.data;
};