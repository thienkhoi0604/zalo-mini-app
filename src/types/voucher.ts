export interface VoucherStore {
  id?: string;
  name: string;
  address?: string;
  imageUrl?: string | null;
  googleMapsDirectionUrl?: string | null;
}

// ─── Feed Item Types ───────────────────────────────────────────────────────────
// Defined separately — values will be sourced from Business Logic in the future

export const FEED_ITEM_TYPES = {
  VOUCHER: 'Voucher',
  PHYSICAL_ITEM: 'PhysicalItem',
  FNB_PRODUCT: 'FnbProduct',
  SERVICE: 'Service',
  RETAIL_PRODUCT: 'RetailProduct',
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
  shortDescription: string | null;
  imageUrl: string;
  storeImageUrl: string | null;
  storeId: string | null;
  storeName: string | null;
  provinceCode: string | null;
  provinceName: string | null;
  wardCode: string | null;
  wardName: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  storeAddress: string | null;
  storePhone: string | null;
  storeOperatingHours: string | null;
  storeOpenTime: string | null;
  storeCloseTime: string | null;
  workingStatus: string | null;
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
  /** Maps to the `StoreId` query param on /app/feed */
  storeId?: string;
}

// ─── Grouped feed (Grouped=true) ──────────────────────────────────────────────

export interface StoreGroup {
  storeId: string;
  storeName: string;
  address: string | null;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  phone: string | null;
  openFrom: string | null;
  openTo: string | null;
  workingStatus: string | null;
  items: Voucher[];
}

export interface GroupedFeedResult {
  globalVouchers: Voucher[];
  stores: StoreGroup[];
}

// ─── Store item detail API (/app/store-items/:id) ──────────────────────────────

export interface StoreItemApiResponse {
  id: string;
  storeId: string;
  storeName: string;
  provinceCode: string | null;
  provinceName: string | null;
  wardCode: string | null;
  wardName: string | null;
  type: number;
  typeName: string;
  code: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  address: string | null;
  price: number | null;
  coinCost: number | null;
  imageUrl: string;
  storeImageUrl: string | null;
  stock: number | null;
  totalSales: number | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  googleMapsDirectionUrl: string | null;
}

// ─── Legacy Voucher detail API (single-item endpoint) ──────────────────────────

export interface AppliedStore {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  storeImageUrl: string | null;
  phone: string | null;
  googleMapsDirectionUrl: string | null;
}

export interface VoucherApiItem {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string | null;
  shortDescription: string | null;
  pointCost: number;
  stock: number;
  imageUrl: string;
  validFrom: string | null;
  validTo: string | null;
  appliesToAll: boolean;
  isActive: boolean;
  storeIds: string[];
  storeNames: string[];
  appliedStores?: AppliedStore[];
}

// ─── Unified internal Voucher type ─────────────────────────────────────────────

export type VoucherSource = 'Reward' | 'StoreItem';

/** GreenCoin = wallet balance spent on StoreItems; Lá = earned from QR check-ins, spent on Vouchers */
export type VoucherCostCurrency = 'GreenCoin' | 'Lá';

export interface Voucher {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  shortDescription?: string;
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
    case FEED_ITEM_TYPES.VOUCHER:        return 'Voucher điện tử';
    case FEED_ITEM_TYPES.PHYSICAL_ITEM:  return 'Quà hiện vật';
    case FEED_ITEM_TYPES.FNB_PRODUCT:    return 'Đồ ăn & Thức uống';
    case FEED_ITEM_TYPES.SERVICE:        return 'Dịch vụ';
    case FEED_ITEM_TYPES.RETAIL_PRODUCT: return 'Sản phẩm bán lẻ';
    default:                              return type;
  }
}

// ─── User Vouchers (my-vouchers) ────────────────────────────────────────────────

export type UserVoucherItemType = 'Reward' | 'Product';

export interface UserVoucher {
  id: string;
  code: string;
  imageUrl: string | null;
  rewardId: string | null;
  rewardName: string;
  shortDescription: string | null;
  storeName: string | null;
  storeItemId: string | null;
  itemType: UserVoucherItemType;
  status: string;
  issuedAt: string;
  expiredAt: string;
  usedAt: string | null;
  appliesToAll: boolean | null;
  appliedStores: AppliedStore[] | null;
}

export interface GetUserVouchersParams {
  pageNumber?: number;
  pageSize?: number;
}
