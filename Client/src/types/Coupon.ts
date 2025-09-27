export interface CouponForm {
    id: string | number;
    code: string;
    discountType: "Percentage" | "Direct";
    discount: number;
    maxDiscount?: number;
    condition?: number;
    details?: string;
    endDate: string;
    status?: number;
    statusName?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}