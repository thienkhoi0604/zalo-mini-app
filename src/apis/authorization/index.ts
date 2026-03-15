declare const APP_CONFIG: {
  apiBaseUrl?: string;
};

const API_BASE_URL =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.apiBaseUrl) ||
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

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      throw new Error("Token refresh failed");
    }

    const data = (await res.json()) as { tokens: JwtTokens };
    saveTokens(data.tokens);
  } finally {
    isRefreshing = false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token and retry
  if (res.status === 401) {
    try {
      await refreshTokens();
      // Retry the request with new token
      const newToken = getAccessToken();
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (newToken) {
        (retryHeaders as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      });
      if (!retryRes.ok) {
        throw new Error(`API error: ${retryRes.status}`);
      }
      return (await retryRes.json()) as T;
    } catch (error) {
      clearTokens();
      throw error;
    }
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return (await res.json()) as T;
}

export type BackendUser = {
  id: string;
  zaloId: string;
  displayName?: string;
  avatar?: string;
};

export async function loginWithZaloUser(userInfo: any, zaloAccessToken: string) {
  const payload = {
    // Send Zalo access token for backend verification
    zaloAccessToken: zaloAccessToken,
    // Optional: also send user info for easier backend processing
    zaloId: userInfo.id,
    displayName: userInfo.name,
    avatar: userInfo.avatar,
  };

  // Use fetch directly since we don't have auth token yet
  const res = await fetch(`${API_BASE_URL}/auth/zalo-miniapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  const data = (await res.json()) as { user: BackendUser; tokens: JwtTokens };
  saveTokens(data.tokens);
  return data.user;
}

export async function fetchUserInfo(): Promise<BackendUser> {
  return apiFetch<{ user: BackendUser }>("/auth/me").then((res) => res.user);
}

