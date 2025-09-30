export interface CouponForm {
    id: string | number;
    name?: string;
    slug?: string;
    code: string;
    discountType: "Percentage" | "Direct";
    discount: number;
    maxDiscount?: number;
    condition?: number;
    details?: string;
    endDate: string;
    status?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}