export interface PaymentMethod {
    paymentMethodId: number;
    description: string
}

export interface PaymentMethodForm {
    id: string | number;
    description?: string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}