export interface Category {
    categoryId: number;
    name: string;
    slug: string;
}

export interface CategoryForm {
    id: string | number;
    name?: string;
    slug?: string;
    parentId?: number | null;
    parentName?: string;
    status?: number;
    statusName?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}