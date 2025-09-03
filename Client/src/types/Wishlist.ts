import { type Product } from "./Product";

export interface CustomerWishlist {
    wishlistId: string;
    productId: string;
    product: Product;
}