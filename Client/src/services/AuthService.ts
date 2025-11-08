import axios from "axios";
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../types/Auth";
import { handleAxiosError } from "../utils/handleAxiosError";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/login", credentials);
      return { ...response.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Login failed. Please try again.");
    }
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post("/api/auth/register", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Registration failed. Please try again.");
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/forgot-password", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Failed to send OTP. Please try again.");
    }

  },

  async resetPassword(data: ResetPasswordRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>("/api/auth/reset-password", data);
      return { ...response.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Failed to reset password. Please try again.");
    }
  },

  async googleLogin(idToken: string): Promise<LoginResponse> {
    try {
      const res = await axios.post<LoginResponse>(`/api/auth/signin-google`, {
        idToken
      });
      return { ...res.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Failed to sign in with Google. Please try again.");
    }
  },

  async facebookLogin(accessToken: string): Promise<LoginResponse> {
    try {
      const res = await axios.post(`/api/auth/signin-facebook`, {
        AccessToken: accessToken,
      });
      return { ...res.data, success: true };
    } catch (err: any) {
      return handleAxiosError(err, "Failed to sign in with Facebook. Please try again.");
    }
  }
};