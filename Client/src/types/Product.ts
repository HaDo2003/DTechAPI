import { type Category } from "./Category";
import { type Brand } from "./Brand";
import { type ProductCommentResponse } from "./ProductComment";
import { type ProductImage } from "./ProductImage";
import { type Specification} from "./Specification";
import type { MessageResponse } from "./MessageReponse";

export interface Product {
    productId: number;
    name: string;
    slug: string;
    warranty: string;
    statusProduct: boolean;
    price: number;
    discount: number;
    priceAfterDiscount: number;
    endDateDiscount: string | null;
    views: number;
    dateOfManufacture: string | null;
    madeIn: string | null;
    promotionalGift?: string | null;
    photo: string;
    description: string;
    category: Category;
    brand: Brand;
    productComments: ProductCommentResponse[];
    productImages: ProductImage[];
    specifications: Specification[];
    relatedProducts: Product[];
}

export interface SearchProductProps extends MessageResponse{
    products?: Product[];
    initialSort?: string;
}

export interface ProductForm {
    id: string | number;
    name?: string;
    slug?: string;
    warranty?: string;
    statusProduct?: boolean;
    price?: number;
    discount?: number;
    priceAfterDiscount: number;
    endDateDiscount?: string | null;
    dateOfManufacture?: string | null;
    madeIn?: string | null;
    promotionalGift?: string | null;
    photo?: string;
    photoUpload?: File;
    description?: string;
    categoryId?: number | string;
    brandId?: number | string;
    specifications?: Specification[];
    productImages?: File[];
}