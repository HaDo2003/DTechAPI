import axios from "axios";
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../types/Auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/login", credentials);
      return { ...response.data, success: true };
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        let message: string = "Login failed. Please try again.";

        if (typeof err.response?.data === "string") {
          message = err.response.data;
        }
        else if (typeof err.response?.data?.message === "string") {
          message = err.response.data.message;
        }
        else {
          message = JSON.stringify(err.response?.data);
        }

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
        let message: string = "Registration failed. Please try again.";

        if (typeof err.response?.data === "string") {
          message = err.response.data;
        }
        else if (typeof err.response?.data?.message === "string") {
          message = err.response.data.message;
        }
        else {
          message = JSON.stringify(err.response?.data);
        }

        return { success: false, message };
      }

      return { success: false, message: "Unexpected error occurred" };
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/forgot-password", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        let message: string = "Failed to send OTP. Please try again.";

        if (typeof err.response?.data === "string") {
          message = err.response.data;
        }
        else if (typeof err.response?.data?.message === "string") {
          message = err.response.data.message;
        }
        else {
          message = JSON.stringify(err.response?.data);
        }

        return { success: false, message };
      }
      return { success: false, message: "Unexpected error occurred" };
    }

  },

  async resetPassword(data: ResetPasswordRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/reset-password", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      let message: string = "Failed to reset password. Please try again.";

      if (typeof err.response?.data === "string") {
        message = err.response.data;
      }
      else if (typeof err.response?.data?.message === "string") {
        message = err.response.data.message;
      }
      else {
        message = JSON.stringify(err.response?.data);
      }

      return { success: false, message };
    }
  },
};