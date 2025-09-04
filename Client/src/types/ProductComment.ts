export interface ProductComment {
    name?: string;
    email?: string;
    detail?: string;
    rate?: number;
}

export interface ProductCommentRequest extends ProductComment{
    productId?: number;
}

export interface ProductCommentResponse extends ProductComment{
    commentId?: number;
    cmtDate?: string;
    success?: boolean;
    message?: string;
}