import axios from "axios";
import { type LoginRequest, type LoginResponse } from "../types/Login";
import { type RegisterRequest } from "../types/Register";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/login", credentials);
      return { ...response.data, success: true };
    }catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Backend usually sends error in err.response.data
        const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Login failed. Please try again.";

        return { success: false, message };
      }

      return { success: false, message: "Unexpected error occurred" };
    }
    
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post("/api/auth/register", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Please try again.";

        return { success: false, message };
      }

      return { success: false, message: "Unexpected error occurred" };
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await axios.post("/api/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post("/api/auth/reset-password", { token, newPassword });
  },
};