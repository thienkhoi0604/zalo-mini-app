export interface RewardStore {
  address: string;
}

export interface Reward {
  id: string;
  code: string;
  name: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  category: string;
  brandName?: string;
  brandLogoUrl?: string;
  stores?: RewardStore[];
  terms?: string;
  pointsRequired: number;
  applicableTimeStart: string;
  applicableTimeEnd: string;
  programNotes: string;
  usageGuide: string;
  status: 'active' | 'expired';
}

export interface UserReward {
  id: string;
  code: string;
  rewardName: string;
  storeName: string | null;
  status: string;
  issuedAt: string;
  expiredAt: string;
  usedAt: string | null;
}

export interface RewardsFilter {
  category?: string;
  search?: string;
}

export enum REWARD_TYPES {
  VOUCHER = 'Voucher',
  PRODUCT = 'PhysicalItem',
}

export interface RewardApiItem {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string | null;
  pointCost: number;
  stock: number;
  imageUrl: string;
  validFrom: string | null;
  validTo: string | null;
  appliesToAll: boolean;
  isActive: boolean;
  storeIds: string[];
  storeNames: string[];
}

export interface GetRewardsParams {
  pageNumber?: number;
  pageSize?: number;
  type?: REWARD_TYPES;
}

export interface GetUserRewardsParams {
  pageNumber?: number;
  pageSize?: number;
}
