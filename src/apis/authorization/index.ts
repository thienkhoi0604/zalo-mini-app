import axios from "axios";
import { User } from "@/types/user";

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
  expiresIn?: number;
};

const ACCESS_TOKEN_KEY = "ecogreen_access_token";
const REFRESH_TOKEN_KEY = "ecogreen_refresh_token";
const TOKEN_EXPIRY_KEY = "ecogreen_token_expiry";

export function saveTokens(tokens: JwtTokens) {
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  // Calculate and save token expiry time
  if (tokens.expiresIn) {
    const expiryTime = Date.now() + tokens.expiresIn * 1000;
    window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getTokenExpiryTime() {
  const expiry = window.localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
}

export function isTokenExpired() {
  const expiryTime = getTokenExpiryTime();
  if (!expiryTime) return true;
  return Date.now() > expiryTime;
}

export function shouldRefreshToken() {
  const expiryTime = getTokenExpiryTime();
  if (!expiryTime) return false;
  // Refresh if token expires within 1 minute
  const refreshBuffer = 60 * 1000;
  return Date.now() > expiryTime - refreshBuffer;
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

    const data = res.data as { tokens: JwtTokens };
    saveTokens(data.tokens);
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

export async function loginWithZaloUser(userInfo: any, zaloAccessToken: string) {
  const payload = {
    // Send Zalo access token for backend verification
    zaloAccessToken: zaloAccessToken,
    // Optional: also send user info for easier backend processing
    zaloId: userInfo.id,
    displayName: userInfo.name,
    avatar: userInfo.avatar,
  };

  const res = await axios.post(`${API_BASE_URL}/auth/zalo-miniapp`, payload);

  const data = res.data as { user: User; tokens: JwtTokens };
  saveTokens(data.tokens);
  return data.user;
}

export async function fetchUserInfo(): Promise<User> {
  return apiFetch<{ user: User }>("/auth/me").then((res) => res.user);
}

