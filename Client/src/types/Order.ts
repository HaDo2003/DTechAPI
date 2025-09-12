import type { MessageResponse } from "./MessageReponse";
import type { PaymentMethod } from "./PaymentMethod";

export interface Order {
    orderId: string;
    orderDate: string;
    finalCost: number;
    statusName: string;
}

export interface CheckOut extends MessageResponse {
    email?: string;
    billingName?: string;
    billingPhone?: string;
    billingAddress?: string;
    shippingName?: string,
    shippingPhone?: string,
    shippingAddress?: string,
    note?: string;
    reductionCode?: string;
    customerAddresses?: Address[];
    paymentMethods?: PaymentMethod[];
    paymentMethod?: number;
    orderSummary?: OrderSummary;
}

interface Address {
    addressId?: number;
    fullName?: string;
    address?: string;
}

export interface OrderSummary {
    items: OrderItem[];
    itemCount: number;
    subTotal: number;
    shippingFee: number;
    discountAmount?: number;
    total: number;
}

export interface OrderItem {
    productId?: number;
    name: string;
    photo: string;
    quantity: number;
    price: number;
}

export interface CouponResponse {
    success: boolean;
    message?: string;
    discountAmount?: number;
    total?: number;
}