import axios from 'axios';
import { User } from '@/types/user';
import { API_BASE_URL } from './client';

export type JwtTokens = {
  accessToken: string;
  refreshToken?: string;
};

const ACCESS_TOKEN_KEY = 'ecogreen_access_token';
const REFRESH_TOKEN_KEY = 'ecogreen_refresh_token';

// ─── Token Accessors ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(tokens: JwtTokens): void {
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

type RefreshResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export async function refreshTokens(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  const res = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/Auth/refresh-token`,
    { refreshToken },
  );

  saveTokens({
    accessToken: res.data.data.accessToken,
    refreshToken: res.data.data.refreshToken,
  });
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

type LoginResponse = {
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
      points?: number;
      ratingPoints?: number;
    };
  };
};

export async function loginWithZaloUser(
  zaloAccessToken: string,
): Promise<User> {
  const res = await axios.post<LoginResponse>(
    `${API_BASE_URL}/Auth/zalo-login`,
    { accessToken: zaloAccessToken },
  );

  const { data } = res.data;

  saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return {
    id: data.user.id,
    zaloUserId: data.user.zaloUserId,
    fullName: data.user.fullName,
    avatarUrl: data.user.avatarUrl,
    phone: data.user.phone ?? undefined,
    role: data.user.role,
    userName: data.user.userName ?? undefined,
    points: data.user.points ?? 0,
    ratingPoints: data.user.ratingPoints ?? 0,
  };
}

export async function fetchUserInfo(): Promise<User> {
  const { axiosClient } = await import('./client');
  const { data } = await axiosClient.get<{ data: User }>('/auth/me');
  return data.data;
}
