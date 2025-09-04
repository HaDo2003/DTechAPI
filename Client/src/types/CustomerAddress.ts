export interface CustomerAddress {
    addressId: number | null;
    fullName: string;
    phoneNumber: string;
    provinceId: number | null;
    address: string;
    isDefault: boolean;
}

export interface CustomerAddressResponse {
    success?: boolean;
    message?: string;
    addressId?: number;
}