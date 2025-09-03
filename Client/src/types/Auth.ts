export interface LoginRequest {
    account: string;
    password: string;
}

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

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    email: string;
    newPassword: string;
}

export interface LoginResponse {
    token?: string;
    message?: string;
    success?: boolean;
}