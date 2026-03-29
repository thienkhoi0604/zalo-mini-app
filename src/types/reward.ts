export interface RewardStore {
  address: string;
}

export const STORE_ITEM_TYPE_OPTIONS = [
  { value: 0, label: 'Retail Products (In Stock)' },
  { value: 1, label: 'F&B Goods (In Store)' },
  { value: 2, label: 'Services (Consulting, Fees...)' },
] as const;

export type StoreItemType = 0 | 1 | 2;

export function getStoreItemTypeLabel(type: StoreItemType): string {
  return STORE_ITEM_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? String(type);
}

export interface StoreItemApiItem {
  id: string;
  storeId: string;
  storeName: string;
  type: StoreItemType;
  typeName: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  coinCost: number;
  imageUrl: string;
  stock: number | null;
  totalSales: number;
  distanceKm: number | null;
}

export const REWARD_TYPE_OPTIONS = [
  { value: 'Voucher', label: 'Voucher điện tử', prefix: 'VCR' },
  { value: 'PhysicalItem', label: 'Quà hiện vật', prefix: 'PHY' },
] as const;

export function getRewardTypeLabel(type: string): string {
  const rewardMatch = REWARD_TYPE_OPTIONS.find((o) => o.value === type);
  if (rewardMatch) return rewardMatch.label;
  const storeMatch = STORE_ITEM_TYPE_OPTIONS.find((o) => String(o.value) === type);
  if (storeMatch) return storeMatch.label;
  return type;
}

export type RewardSource = 'reward' | 'product';

export interface Reward {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  category: string;
  source: RewardSource;
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

export type UserRewardItemType = 'Reward' | 'Product';

export interface UserReward {
  id: string;
  code: string;
  rewardName: string;
  storeName: string | null;
  storeItemId: string | null;
  itemType: UserRewardItemType;
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
