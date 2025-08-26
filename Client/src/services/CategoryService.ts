import axios from "axios";
import {type Product} from "../types/Product";
import {type Brand} from "../types/Brand";

export interface CategoryPageProps {
  title: string;
  products: Product[];
  brands?: Brand[];
  initialSort?: string;
  categorySlug: string;
}

export const getCategoryProducts = async (slug: string, sortOrder?: string): Promise<CategoryPageProps> => {
  const res = await axios.get<CategoryPageProps>(`/api/Product/${slug}`, {
    params: { sortOrder }
  });
  return res.data;
};