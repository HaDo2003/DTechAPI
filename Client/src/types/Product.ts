import { type Category } from "./Category";
import { type Brand } from "./Brand";

export interface Product {
    id: number;
    name: string;
    photo: string;
    slug: string;
    price: number;           
    finalPrice: number;      
    discount: number;        
    promotionalGift?: string | null;
    category: Category;
    brand: Brand;
}