import { UserRank } from './user';

export type JwtTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type RefreshResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type LoginResponseUser = {
  id: string;
  zaloUserId: string;
  userName: string | null;
  fullName: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string;
  role: string;
  address: string | null;
  provinceCode: string | null;
  wardCode: string | null;
  latitude: number;
  longitude: number;
  isVehicleApproved: boolean;
  status: string;
  lastLoginAt: string;
  createdAt: string;
  rank?: UserRank;
  points?: number;
  verified?: boolean;
  voucherCount?: number;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: LoginResponseUser;
  };
};
