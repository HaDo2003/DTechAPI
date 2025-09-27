export interface Brand {
    brandId: number;
    name: string;
    slug: string;
    logo: string;
}

export interface BrandForm {
    id: number | string;
    name?: string;
    slug?: string;
    status?: number;
    statusName?: string;
    logo?: string;
    logoUpload?: File;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}