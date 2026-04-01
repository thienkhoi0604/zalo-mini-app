export interface RewardStore {
  id?: string;
  name: string;
  address?: string;
}

// ─── Feed Item Types ───────────────────────────────────────────────────────────
// Defined separately — values will be sourced from Business Logic in the future

export const FEED_ITEM_TYPES = {
  VOUCHER: 'Voucher',
  PHYSICAL_ITEM: 'PhysicalItem',
  FNB_PRODUCT: 'FnbProduct',
} as const;

export type FeedItemType = (typeof FEED_ITEM_TYPES)[keyof typeof FEED_ITEM_TYPES];

// ─── Feed API ──────────────────────────────────────────────────────────────────

export interface FeedApiItem {
  id: string;
  sourceType: 'Reward' | 'StoreItem';
  itemType: FeedItemType;
  itemTypeTranslate: string;
  code: string;
  name: string;
  description: string | null;
  imageUrl: string;
  storeId: string | null;
  storeName: string | null;
  provinceCode: string | null;
  provinceName: string | null;
  wardCode: string | null;
  wardName: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  price: number | null;
  coinCost: number | null;
  stock: number | null;
  totalSales: number | null;
  pointCost: number | null;
  validFrom: string | null;
  validTo: string | null;
  appliesToAll: boolean | null;
}

export interface GetFeedParams {
  pageNumber?: number;
  pageSize?: number;
  /** Maps to the `Type` query param on /app/feed */
  type?: FeedItemType;
}

// ─── Grouped feed (Grouped=true) ──────────────────────────────────────────────

export interface StoreGroup {
  storeId: string;
  storeName: string;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
  items: Reward[];
}

export interface GroupedFeedResult {
  globalRewards: Reward[];
  stores: StoreGroup[];
}

// ─── Legacy Reward detail API (single-item endpoint) ──────────────────────────

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

// ─── Unified internal Reward type ─────────────────────────────────────────────

export type RewardSource = 'Reward' | 'StoreItem';

/** GreenCoin = wallet balance spent on StoreItems; Points = earned from QR check-ins, spent on Rewards */
export type RewardCostCurrency = 'GreenCoin' | 'Points';

export interface Reward {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  /** itemTypeTranslate from the feed — used as grouping key and route param */
  category: string;
  source: RewardSource;
  brandName?: string;
  brandLogoUrl?: string;
  stores?: RewardStore[];
  appliesToAll?: boolean;
  terms?: string;
  /** Currency required to redeem: GreenCoin (store items via coinCost) or Points (rewards via pointCost) */
  costCurrency: RewardCostCurrency;
  /** Cost in the currency indicated by costCurrency */
  pointsRequired: number;
  /** Original price (store items only) */
  price?: number | null;
  /** Remaining stock, null = unlimited */
  stock?: number | null;
  applicableTimeStart: string;
  applicableTimeEnd: string;
  programNotes: string;
  usageGuide: string;
  status: 'active' | 'expired';
}

export function getRewardTypeLabel(type: string): string {
  switch (type) {
    case FEED_ITEM_TYPES.VOUCHER:       return 'Voucher điện tử';
    case FEED_ITEM_TYPES.PHYSICAL_ITEM: return 'Quà hiện vật';
    case FEED_ITEM_TYPES.FNB_PRODUCT:   return 'Đồ ăn & Thức uống';
    default:                             return type;
  }
}

// ─── User Rewards (my-vouchers) ────────────────────────────────────────────────

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

export interface GetUserRewardsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface RewardsFilter {
  category?: string;
  search?: string;
}
