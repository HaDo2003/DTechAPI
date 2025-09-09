export interface CartProduct {
    productId: number;
    quantity: number;
}

export interface CartProductEdit {
    id: number;
    productId: number;
    quantity: number;
    name: string;
    price: number;
    discount?: number;
    priceAfterDiscount: number | null;
    photo?: string;
}
