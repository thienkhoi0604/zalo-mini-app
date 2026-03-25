export type UserRank = {
  currentTotalSpent: number;
  currentRankCode: string;
  currentRankName: string;
  nextRankCode: string;
  nextRankName: string;
  nextRankRequiredTotalSpent: number;
  pointsToNext: number;
  progressToNextPercent: number;
};

export type User = {
  id: string;
  zaloUserId?: string;
  userName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  address?: string;
  provinceCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  isVehicleApproved?: boolean;
  status?: string;
  lastLoginAt?: string;
  createdAt?: string;
  rank?: UserRank;
  // Fields used by app logic (may come from login response or separate endpoints)
  points?: number;
  verified?: boolean;
  voucherCount?: number;
};
