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
  imageUpload?: File;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}

export interface CustomerForm {
  id: string | number;
  userName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string
  gender?: string;
  dateOfBirth?: string;
  createDate?: string;
  createdBy?: string;
  updateDate?: string;
  updatedBy?: string;
}

export interface CustomerMonitor {
  userId?: string;
  userName?: string;
  image?: string;
  createdAt?: string;
}
