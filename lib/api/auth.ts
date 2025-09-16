"use client";

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import { AuthResponse } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  company_name: string;
  company_email: string;
  company_address: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

interface OtpInput {
  email: string;
  otp?: string;
}

// Auth API Service
const AuthAPI = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  sendOtp: async (
    data: OtpInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/auth/send-otp", data);
    return response.data;
  },

  verifyOtp: async (
    data: OtpInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/auth/verify-otp", data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};

// Custom hooks using TanStack Query
export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token);

      // Update Zustand store
      setAuth(data.data.token, data.data.user, data.data.company);
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: AuthAPI.register,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token);

      // Update Zustand store
      setAuth(data.data.token, data.data.user, data.data.company);
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: AuthAPI.sendOtp,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: AuthAPI.verifyOtp,
  });
};

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      // Clear auth store
      clearAuth();
      // Remove token from localStorage
      localStorage.removeItem("auth_token");
      // Redirect to login
      router.push("/auth/login");
    },
  });
};
