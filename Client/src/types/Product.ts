import { type Category } from "./Category";
import { type Brand } from "./Brand";
import { type ProductCommentResponse } from "./ProductComment";
import { type ProductImage } from "./ProductImage";
import { type Specification} from "./Specification";
import type { MessageResponse } from "./MessageReponse";
import type { ProductColor } from "./ProductColor";
import type { ProductModel } from "./ProductModel";

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
    productColors: ProductColor[];
    productModels: ProductModel[];
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
    statusProduct?: string;
    initialCost?: number;
    price?: number;
    discount?: number;
    priceAfterDiscount: number;
    endDateDiscount?: string | null;
    dateOfManufacture?: string | null;
    madeIn?: string | null;
    views?: number;
    promotionalGift?: string | null;
    description?: string;
    photo?: string;
    photoUpload?: File;
    categoryId?: number | string;
    brandId?: number | string;
    createDate?: string;
    createdBy?: string;
    updateDate?: string;
    updatedBy?: string;
}

export interface ProductFormProp {
    productInfor: ProductForm;
    productColors?: ProductColor[];
    specifications?: Specification[];
    productImages?: ProductImage[];
    productModels?: ProductModel[];
}