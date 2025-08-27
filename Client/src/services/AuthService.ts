import axios from "axios";
import { jwtDecoder } from "../utils/jwtDecoder";

export interface LoginRequest {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: string;
    userName: string;
    role: string;
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

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>("/api/auth/login", data);
    return response.data;
}

export const register = async (data: RegisterRequest): Promise<void> => {
    await axios.post("/api/auth/register", data);
};

const TOKEN_KEY = "jwt_token";

export const authService = {
  async login(credentials: LoginRequest) {
    const { token } = await login(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    const res = jwtDecoder(token);
    return res;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};