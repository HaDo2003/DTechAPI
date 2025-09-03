import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
    sub: string;
    unique_name: string;
    role: string | string[];
    exp: number;
}

export const jwtDecoder = (token: string): (string | string[]) | null => {
    if (!token || token.split(".").length !== 3) {
        return null;
    }
    try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return null;
        }

        return decoded.role;
    } catch {
        return null;
    }
};