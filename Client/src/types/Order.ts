import type { MessageResponse } from "./MessageReponse";
import type { PaymentMethod } from "./PaymentMethod";

export interface Order {
    orderId: string;
    orderDate: string;
    finalCost: number;
    statusName: string;
}

export interface OrderForm{
    id: number | string;
    statusName?: string;
    email?: string;
    billingName?: string;
    billingPhone?: string;
    billingAddress?: string;
    shippingName?: string,
    shippingPhone?: string,
    shippingAddress?: string,
    note?: string;
    finalCost?: number;
    payment?:
    {
        method: string;
        status: string;
    };
    orderProducts?:
    {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
        total: number;
        promotionalGift?: string;
    }[];
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
    promotionalGift?: string;
}

export interface CouponResponse {
    success: boolean;
    message?: string;
    discountAmount?: number;
    total?: number;
}

export interface OrderDetailResponse extends MessageResponse {
    orderId?: string;
    orderDate?: string;
    name?: string;
    nameReceive?: string;
    shippingAddress?: string;
    address?: string;
    payment?: Payment;
    statusName?: string;
    note?: string;
    orderProducts?: OrderProduct[];
    costDiscount?: number;
    shippingCost?: number;
    finalCost?: number;
}

interface OrderProduct {
    id?: string;
    name?: string;
    photo?: string;
    price?: number;
    quantity?: number;
    costAtPurchase?: number;
}

interface Payment {
    status?: number;
    paymentMethodName?: string;
}