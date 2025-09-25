import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://api.squaremethods.com/api",
  headers: {
    "Content-Type": "application/json",
    "X-Company-ID": process.env.NEXT_PUBLIC_COMPANY_ID,
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the response has a message, show it as success
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error: AxiosError<APIResponse<unknown>>) => {
    // Handle errors
    const message =
      (error.response?.data as APIResponse<unknown>)?.message ||
      "An error occurred";
    toast.error(message);

    // If unauthorized (401), clear local storage and reload
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
