import { type Category } from "./Category";
import { type Brand } from "./Brand";
import { type ProductComment } from "./ProductComment";
import { type ProductImage } from "./ProductImage";
import { type Specification} from "./Specification";

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
    productComments: ProductComment[];
    productImages: ProductImage[];
    specifications: Specification[];
    relatedProducts: Product[];
}