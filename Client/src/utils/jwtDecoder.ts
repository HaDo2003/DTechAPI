import { jwtDecode } from "jwt-decode";
import { type LoginResponse } from "../services/AuthService";

export interface TokenPayload {
    sub: string;
    unique_name: string;
    role: string;
    exp: number;
}

export const jwtDecoder = (token: string): LoginResponse | null => {
    if (!token || token.split(".").length !== 3) {
        return null;
    }
    const decoded = jwtDecode<TokenPayload>(token);
    const res: LoginResponse = {
        token,
        userId: decoded.sub,
        userName: decoded.unique_name,
        role: decoded.role,
    };
    return res;
};