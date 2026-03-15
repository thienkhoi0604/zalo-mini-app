import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  clearTokens,
  refreshTokens,
} from "./authorization";
import { useUserStore } from "stores/user";
import { showNotification } from "utils/notification";

declare const APP_CONFIG: {
  apiBaseUrl?: string;
};

const API_BASE_URL =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.apiBaseUrl) ||
  "https://api.ecogreen-coin.dev";

// Track if a token refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create axios instance
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add Authorization header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh and errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokens();
        const token = getAccessToken();
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        processQueue(null, token);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        clearTokens();
        useUserStore.getState().logout();
        processQueue(refreshError, null);
        showNotification("Session expired. Please login again.", "error");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          showNotification(
            data?.message || "Bad request. Please check your input.",
            "error"
          );
          break;
        case 403:
          showNotification("You don't have permission to perform this action.", "error");
          break;
        case 404:
          showNotification("Resource not found.", "error");
          break;
        case 500:
          showNotification("Server error. Please try again later.", "error");
          break;
        default:
          showNotification(
            data?.message || `Error: ${status}. Please try again.`,
            "error"
          );
      }
    } else if (error.code === "ECONNABORTED") {
      showNotification("Request timeout. Please try again.", "error");
    } else if (error.message === "Network Error") {
      showNotification("Network error. Please check your connection.", "error");
    } else {
      showNotification("An error occurred. Please try again.", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
