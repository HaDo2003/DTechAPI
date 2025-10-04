export interface PostForm {
    id: string | number;
    name?: string;
    description?: string;
    status?: string;
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