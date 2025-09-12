import type { PaymentMethod } from "./PaymentMethod";

type OrderProduct = {
    id?: number;
    name?: string;
    photo?: string;
    quantity?: number;
    costAtPurchase?: number;
};

export interface OrderSuccessModel {
    success: boolean;
    message?: string;
    orderId?: string;
    phone?: string;
    email?: string;
    paymentMethod?: PaymentMethod;
    address?: string;
    shippingAddress?: string;
    shippingCost?: number;
    costDiscount?: number;
    totalCost?: number;
    finalCost?: number;
    orderProducts?: OrderProduct[];
};