export interface PostForm {
    id: string | number;
    name?: string;
    description?: string;
    status?: string;
    isFeatured?: boolean;
    isMain?: boolean;
    postCategoryId?: number | null;
    postCategory?: string;
    image?: string;
    imageUpload?: File;
    postDate?: string;
    postBy?: string;
}

export interface PostCategoryForm {
    id: string | number;
    name?: string;
    slug?: string;
    status?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}

export interface PostCategory {
    categoryId: number;
    name: string;
    slug: string;
}

export interface Post {
    postId: string | number;
    name?: string;
    slug?: string;
    description?: string;
    isFeatured?: boolean;
    isMain?: boolean;
    postCategoryId?: number | null;
    postCategory?: string;
    postCategorySlug?: string;
    image?: string;
    postDate?: string;
    postBy?: string;
}

export interface PostCategoryPageData {
    title?: string;
    posts?: Post[];
    totalPages?: number;
    totalItems?: number;
}

export interface PostLayoutData {
    categories?: PostCategory[];
    featuredNews?: Post[];
}

export interface InitialNewsPageData {
    posts?: Post[];
    mainPosts?: Post;
    featuredPosts?: Post[];
    sidebarPosts?: Post[];
}