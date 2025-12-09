import api from "@/lib/axios";
import type { IApiResponse } from "@/types/api-response";
import type { IUser } from "@/types/user";

interface AuthenticationResponse {
  accessToken: string;
  refreshToken?: string;
  authenticated: boolean;
}

export const authService = {
  signUp: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<IUser> => {
    const res = await api.post<IApiResponse<IUser>>(
      "/auth/register",
      { email, password, firstName, lastName },
      { withCredentials: true },
    );

    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Registration failed");
    }

    return res.data.data;
  },

  signIn: async (email: string, password: string): Promise<AuthenticationResponse> => {
    const res = await api.post<IApiResponse<AuthenticationResponse>>(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );

    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Login failed");
    }

    return res.data.data;
  },

  signOut: async (): Promise<void> => {
    await api.post<IApiResponse<void>>("/auth/logout", {}, { withCredentials: true });
  },

  fetchMe: async (): Promise<IUser> => {
    const res = await api.get<IApiResponse<IUser>>("/users/me", { withCredentials: true });

    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Failed to fetch user info");
    }

    return res.data.data;
  },

  refresh: async (): Promise<string> => {
    const res = await api.post<IApiResponse<AuthenticationResponse>>(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );

    if (!res.data.data?.accessToken) {
      throw new Error(res.data.error?.message || "Token refresh failed");
    }

    return res.data.data.accessToken;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post<IApiResponse<void>>("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post<IApiResponse<void>>("/auth/reset-password", { token, newPassword });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.post<IApiResponse<void>>("/auth/verify-email", { token });
  },

  resendVerification: async (email: string): Promise<void> => {
    await api.post<IApiResponse<void>>("/auth/resend-verification", { email });
  },
};
