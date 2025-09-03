export interface CustomerCoupon {
    couponId: string;
    name: string;
    code: string;
    condition: number;
    discount: number;
    maxDiscount: number;
}