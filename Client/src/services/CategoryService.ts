import axios from "axios";
import {type Product} from "../types/Product";
import {type Brand} from "../types/Brand";

export interface CategoryPageProps {
  title: string;
  products: Product[];
  brands?: Brand[];
  initialSort?: string;
  categorySlug: string;
  totalPages?: number;
  totalItems?: number;
}

export const getCategoryProducts = async (slug: string, page: number, pageSize: number, sortOrder?: string): Promise<CategoryPageProps> => {
  const res = await axios.get<CategoryPageProps>(`/api/product/${slug}`, {
    params: { page, pageSize, sortOrder }
  });
  return res.data;
};

export const getCategoryBrandProducts = async (categorySlug: string, brandSlug: string, page: number, pageSize: number, sortOrder?: string): Promise<CategoryPageProps> => {
  const res = await axios.get<CategoryPageProps>(`/api/product/${categorySlug}/${brandSlug}`, {
    params: { page, pageSize, sortOrder }
  });
  return res.data;
};

export const getAllProducts = async (page: number, pageSize: number, sortOrder?: string): Promise<CategoryPageProps> => {
  const res = await axios.get<CategoryPageProps>('/api/product/all-products', {
    params: { page, pageSize, sortOrder },
  });
  return res.data;
};

export const getFilteredProducts = async (
  categorySlug: string,
  filters: any,
  brandSlug?: string
) => {
  const url = brandSlug
    ? `/api/product/${categorySlug}/filter?brandSlug=${brandSlug}`
    : `/api/product/${categorySlug}/filter`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });

  return await res.json();
};