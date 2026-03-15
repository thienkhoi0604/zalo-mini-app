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

export async function loginWithZaloUser(userInfo: any) {
  const payload = {
    zaloId: userInfo.id,
    displayName: userInfo.name,
    avatar: userInfo.avatar,
  };

  const res = await apiFetch<{ user: BackendUser; tokens: JwtTokens }>(
    "/auth/zalo-miniapp",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  saveTokens(res.tokens);
  return res.user;
}

