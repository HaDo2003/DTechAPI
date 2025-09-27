import { useState, useEffect } from "react";
import { getRecentlyViewProductData } from "../services/RecentlyViewService";
import { type Product } from "../types/Product";

export function useRecentlyViewed() {
    const [RVData, setRVData] = useState<Product[]>([]);

    useEffect(() => {
        getRecentlyViewProductData().then((res) => {
            setRVData(res);
        });
    }, []);

    return RVData;
}