import axios from "axios";
import { User } from "@/types/user";
import mockData from "../../../mock/auth-login-response.json"

declare const APP_CONFIG: {
  apiBaseUrl?: string;
};

const API_BASE_URL =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.apiBaseUrl) ||
  import.meta.env.VITE_API_URL ||
  "https://api.ecogreen-coin.dev";

export type JwtTokens = {
  accessToken: string;
  refreshToken?: string;
};

const ACCESS_TOKEN_KEY = "ecogreen_access_token";
const REFRESH_TOKEN_KEY = "ecogreen_refresh_token";

export function saveTokens(tokens: JwtTokens) {
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

let isRefreshing = false;

export async function refreshTokens(): Promise<void> {
  if (isRefreshing) return;

  isRefreshing = true;
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      throw new Error("No refresh token available");
    }

    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const responseData = res.data as {
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    };

    const tokens: JwtTokens = {
      accessToken: responseData.data.accessToken,
      refreshToken: responseData.data.refreshToken,
    };

    saveTokens(tokens);
  } catch (error) {
    clearTokens();
    throw error;
  } finally {
    isRefreshing = false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: Partial<{ method: string; headers?: Record<string, string>; data?: unknown }> = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await axios({
      url: `${API_BASE_URL}${path}`,
      method: options.method || "GET",
      headers,
      data: options.data,
    });

    return res.data as T;
  } catch (error: unknown) {
    // Handle 401 - try to refresh token and retry
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        await refreshTokens();
        // Retry the request with new token
        const newToken = getAccessToken();
        const retryHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        };
        if (newToken) {
          retryHeaders.Authorization = `Bearer ${newToken}`;
        }
        const retryRes = await axios({
          url: `${API_BASE_URL}${path}`,
          method: options.method || "GET",
          headers: retryHeaders,
          data: options.data,
        });
        return retryRes.data as T;
      } catch (retryError) {
        clearTokens();
        throw retryError;
      }
    }
    throw error;
  }
}

export async function loginWithZaloUser(zaloAccessToken: string) {
  const payload = {
    // Send Zalo access token for backend verification
    zaloAccessToken: zaloAccessToken,
  };

  // const res = await axios.post(`${API_BASE_URL}/auth/zalo-login`, payload);
  const res = {
    data: mockData
  }

  const responseData = res.data as {
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        zaloUserId: string;
        userName: string | null;
        fullName: string;
        phone: string | null;
        avatarUrl: string;
        role: string;
      };
    };
  };

  const tokens: JwtTokens = {
    accessToken: responseData.data.accessToken,
    refreshToken: responseData.data.refreshToken,
  };

  const user: User = {
    id: responseData.data.user.id,
    zaloUserId: responseData.data.user.zaloUserId,
    fullName: responseData.data.user.fullName,
    avatarUrl: responseData.data.user.avatarUrl,
    phone: responseData.data.user.phone || undefined,
    role: responseData.data.user.role,
    userName: responseData.data.user.userName || undefined,
  };

  saveTokens(tokens);
  return user;
}

export async function fetchUserInfo(): Promise<User> {
  const res = await apiFetch<{ data: User }>("/auth/me");
  return res.data;
}

