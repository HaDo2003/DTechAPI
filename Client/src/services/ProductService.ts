import axios from "axios";
import { type Product } from "../types/Product";
import { type ProductCommentRequest, type ProductCommentResponse } from "../types/ProductComment";

export const productService = {
  async getProductData(categorySlug: string, brandSlug: string, slug: string): Promise<Product> {
    const res = await axios.get<Product>(`/api/product/${categorySlug}/${brandSlug}/${slug}`);
    return res.data;
  },

  async postComment(data: ProductCommentRequest): Promise<ProductCommentResponse> {
    try {
      const response = await axios.post<ProductCommentResponse>("/api/product/post-comment", data);
      return {
        success: true,
        message: response.data.message || "Post Comment successfully",
        commentId: response.data.commentId,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        let message: string = "Failed to post comment. Please try again.";
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
