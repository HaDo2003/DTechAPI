import { type InitialNewsPageData, type PostCategoryPageData, type PostLayoutData } from "../types/Post";
import { handleAxiosError } from "../utils/handleAxiosError";
import axios from "axios";

export const postService = {
    async getPostCategories(): Promise<PostLayoutData> {
        try {
            const response = await axios.get<PostLayoutData>('/api/news/get-all-categories');
            return response.data;
        } catch (error) {
            handleAxiosError(error, "Failed to fetch post categories. Please try again.");
            return {
                categories: [],
                featuredNews: [],
            };
        }
    },

    async getInitialNewsPageData(): Promise<InitialNewsPageData> {
        try {
            const response = await axios.get<InitialNewsPageData>('/api/news/get-initial-page');
            return response.data;
        } catch (error) {
            handleAxiosError(error, "Failed to fetch initial news page data. Please try again.");
            return {
                posts: [],
                mainPosts: undefined,
                featuredPosts: [],
                sidebarPosts: [],
            };
        }
    },

    async getPostsByCategory(categorySlug: string , page: number, pageSize: number): Promise<PostCategoryPageData> {
        try {
            const response = await axios.get<PostCategoryPageData>(`/api/news/get-posts-by-category/${categorySlug}`, {
                params: { page, pageSize }
            });
            return response.data;
        } catch (error) {
            handleAxiosError(error, "Failed to fetch posts. Please try again.");
            return {
                title: "",
                posts: [],
                totalPages: 0,
                totalItems: 0
            };
        }
    },

    async getPostData(postSlug: string) {
        try {
            const response = await axios.get(`/api/news/get-post-by-slug/${postSlug}`);
            return response.data;
        } catch (error) {
            handleAxiosError(error, "Failed to fetch post detail. Please try again.");
            return null;
        }
    }
};