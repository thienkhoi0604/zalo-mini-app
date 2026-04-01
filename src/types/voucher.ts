export interface VoucherStore {
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
  address: string | null;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
  items: Voucher[];
}

export interface GroupedFeedResult {
  globalVouchers: Voucher[];
  stores: StoreGroup[];
}

// ─── Legacy Voucher detail API (single-item endpoint) ──────────────────────────

export interface VoucherApiItem {
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

// ─── Unified internal Voucher type ─────────────────────────────────────────────

export type VoucherSource = 'Reward' | 'StoreItem';

/** GreenCoin = wallet balance spent on StoreItems; Points = earned from QR check-ins, spent on Vouchers */
export type VoucherCostCurrency = 'GreenCoin' | 'Points';

export interface Voucher {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  /** itemTypeTranslate from the feed — used as grouping key and route param */
  category: string;
  source: VoucherSource;
  brandName?: string;
  brandLogoUrl?: string;
  stores?: VoucherStore[];
  appliesToAll?: boolean;
  terms?: string;
  /** Currency required to redeem: GreenCoin (store items via coinCost) or Points (vouchers via pointCost) */
  costCurrency: VoucherCostCurrency;
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

export function getVoucherTypeLabel(type: string): string {
  switch (type) {
    case FEED_ITEM_TYPES.VOUCHER:       return 'Voucher điện tử';
    case FEED_ITEM_TYPES.PHYSICAL_ITEM: return 'Quà hiện vật';
    case FEED_ITEM_TYPES.FNB_PRODUCT:   return 'Đồ ăn & Thức uống';
    default:                             return type;
  }
}

// ─── User Vouchers (my-vouchers) ────────────────────────────────────────────────

export type UserVoucherItemType = 'Reward' | 'Product';

export interface UserVoucher {
  id: string;
  code: string;
  rewardName: string;
  storeName: string | null;
  storeItemId: string | null;
  itemType: UserVoucherItemType;
  status: string;
  issuedAt: string;
  expiredAt: string;
  usedAt: string | null;
}

export interface GetUserVouchersParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface VouchersFilter {
  category?: string;
  search?: string;
}
