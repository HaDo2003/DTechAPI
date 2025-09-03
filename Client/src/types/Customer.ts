import { type CustomerAddress } from "./CustomerAddress";
import { type Order } from "./Order";
import { type CustomerCoupon } from "./CustomerCoupon";
import { type CustomerWishlist } from "./Wishlist";

export interface Customer {
    success?: boolean;
    message?: string;
    userName?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    image?: string;    
    customerAddresses?: CustomerAddress[];
    customerCoupons?: CustomerCoupon[];
    wishlists?: CustomerWishlist[];
    orders?: Order[];
}

export interface CustomerProfileForm {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  image: string;
}