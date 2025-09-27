export interface PostForm {
    id: string | number;
    name?: string;
    description?: string;
    postCategoryId?: string | number;
    postCategory?: string;
    image?: string;
    imageUpload?: File;
    postDate?: string;
    postedBy?: string;
}

export interface PostCategoryForm {
    id: string | number;
    name?: string;
    slug?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}