import axios from 'axios';
import { User } from '@/types/user';
import mockData from '@/mock/auth-login-response.json';
import { API_BASE_URL } from './client';

export type JwtTokens = {
  accessToken: string;
  refreshToken?: string;
};

const ACCESS_TOKEN_KEY = 'ecogreen_access_token';
const REFRESH_TOKEN_KEY = 'ecogreen_refresh_token';

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
    `${API_BASE_URL}/auth/refresh`,
    {
      refreshToken,
    },
  );

  saveTokens({
    accessToken: res.data.data.accessToken,
    refreshToken: res.data.data.refreshToken,
  });
}

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
  _zaloAccessToken: string,
): Promise<User> {
  // TODO: replace mock with real call when backend is ready:
  // const { data } = await axiosClient.post<LoginResponse>("/auth/zalo-login", {
  //   zaloAccessToken: _zaloAccessToken,
  // });
  const responseData = mockData as LoginResponse;

  saveTokens({
    accessToken: responseData.data.accessToken,
    refreshToken: responseData.data.refreshToken,
  });

  return {
    id: responseData.data.user.id,
    zaloUserId: responseData.data.user.zaloUserId,
    fullName: responseData.data.user.fullName,
    avatarUrl: responseData.data.user.avatarUrl,
    phone: responseData.data.user.phone ?? undefined,
    role: responseData.data.user.role,
    userName: responseData.data.user.userName ?? undefined,
    points: responseData.data.user.points ?? 0,
    ratingPoints: responseData.data.user.ratingPoints ?? 0,
  };
}

export async function fetchUserInfo(): Promise<User> {
  // Import lazily để tránh circular dependency với client.ts
  const { axiosClient } = await import('./client');
  const { data } = await axiosClient.get<{ data: User }>('/auth/me');
  return data.data;
}
