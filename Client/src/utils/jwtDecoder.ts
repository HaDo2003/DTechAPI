import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
    sub: string;
    unique_name: string;
    role: string;
    exp: number;
    name?: string;
    email?: string;
}

export interface User {
    roles: string;
    name: string;
    email: string;
    exp?: number;
}

export const jwtDecoder = (token: string): User | null => {
    if (!token || token.split(".").length !== 3) return null;

    try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.exp && decoded.exp < Date.now() / 1000) return null;

        return {
            roles: decoded.role ?? "",
            name: decoded.name ?? "",
            email: decoded.email ?? "",
            exp: decoded.exp
        };
    } catch {
        return null;
    }
};

export const isExpired = (user: User | null): boolean => {
    if (!user || !user.exp) return true;
    return user.exp < Date.now() / 1000;
};