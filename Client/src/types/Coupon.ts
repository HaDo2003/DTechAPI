export interface CouponForm {
    id: string | number;
    name?: string;
    slug?: string;
    code: string;
    discountType: "Percentage" | "Direct";
    discount: number;
    maxDiscount?: number;
    condition?: number;
    detail?: string;
    endDate?: string | null;
    status?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}