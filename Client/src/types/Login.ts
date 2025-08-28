export interface LoginRequest {
    account: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    userId?: string;
    userName?: string;
    role?: string;
    message?: string;
    success?: boolean;
}