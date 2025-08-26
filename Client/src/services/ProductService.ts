import axios from "axios";
import {type Product} from "../types/Product";

export const getProductData = async (categorySlug: string, brandSlug: string, slug: string): Promise<Product> => {
  const res = await axios.get<Product>(`/api/product/${categorySlug}/${brandSlug}/${slug}`);
  return res.data;
};