import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { clearTokens, getAccessToken, refreshTokens } from './authorization';
import { useUserStore } from 'stores/user';
import { showNotification } from 'utils/notification';

declare const APP_CONFIG: {
  apiBaseUrl?: string;
};

export const API_BASE_URL =
  (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.apiBaseUrl) ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

type QueueEntry = {
  resolve: (token: string | null) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token);
    }
  });
  failedQueue = [];
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data,
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token && originalRequest.headers) {
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
        processQueue(null, token);
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        useUserStore.getState().setUnauthenticated();
        processQueue(refreshError, null);
        showNotification('Session expired. Please login again.', 'error');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    handleHttpError(error);

    return Promise.reject(error);
  },
);

function handleHttpError(error: AxiosError): void {
  if (error.response?.status) {
    const status = error.response.status;
    const data = error.response.data as { message?: string } | undefined;

    const messages: Partial<Record<number, string>> = {
      400: data?.message ?? 'Bad request. Please check your input.',
      403: "You don't have permission to perform this action.",
      404: 'Resource not found.',
      500: 'Server error. Please try again later.',
    };

    const message =
      messages[status] ?? data?.message ?? `Error ${status}. Please try again.`;

    showNotification(message, 'error');
    return;
  }

  if (error.code === 'ECONNABORTED') {
    showNotification('Request timeout. Please try again.', 'error');
  } else if (error.message === 'Network Error') {
    showNotification('Network error. Please check your connection.', 'error');
  } else {
    showNotification('An error occurred. Please try again.', 'error');
  }
}

export default axiosClient;
