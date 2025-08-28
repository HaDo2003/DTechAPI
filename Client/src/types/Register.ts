export interface RegisterRequest {
    fullName: string;
    account: string;
    email: string;
    phoneNumber: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    password: string;
}