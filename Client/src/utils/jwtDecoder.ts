import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
    sub: string;
    unique_name: string;
    role: string | string[];
    exp: number;
    name?: string;
    email?: string;
}

export interface User {
    roles: string | string[];
    name: string;
    email: string;
}

export const jwtDecoder = (token: string): User | null => {
    if (!token || token.split(".").length !== 3) {
        return null;
    }
    try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return null;
        }

        return {
            roles: decoded.role ?? [],
            name: decoded.name ?? "",
            email: decoded.email ?? ""
        };
    } catch {
        return null;
    }
};

export const isExpired = (token: string): any => {
    if (!token || token.split(".").length !== 3) {
        return false;
    }
    try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return true;
        }

        return false;
    } catch {
        return true;
    }
}