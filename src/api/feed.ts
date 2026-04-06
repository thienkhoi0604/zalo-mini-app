import { FeedApiItem, FEED_ITEM_TYPES, GetFeedParams, GroupedFeedResult, Voucher, StoreGroup } from '@/types/voucher';
import axiosClient from './client';

export function mapFeedItemToVoucher(item: FeedApiItem): Voucher {
  const isStoreItem = item.sourceType === 'StoreItem';
  const validTo = item.validTo ? new Date(item.validTo) : null;
  const status: 'active' | 'expired' = validTo && validTo < new Date() ? 'expired' : 'active';

  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.itemType,
    description: item.description ?? '',
    shortDescription: item.shortDescription ?? undefined,
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: item.itemType === FEED_ITEM_TYPES.VOUCHER ? 'Voucher giảm giá' : item.itemType === FEED_ITEM_TYPES.PHYSICAL_ITEM ? 'Quà tặng vật phẩm' : (item.itemTypeTranslate ?? ''),
    source: item.sourceType,
    brandName: item.storeName ?? undefined,
    costCurrency: isStoreItem ? 'GreenCoin' : 'Lá',
    pointsRequired: isStoreItem ? (item.coinCost ?? 0) : (item.pointCost ?? 0),
    price: item.price,
    stock: item.stock,
    applicableTimeStart: item.validFrom ?? '',
    applicableTimeEnd: item.validTo ?? '',
    programNotes: '',
    usageGuide: '',
    status,
    appliesToAll: item.appliesToAll ?? undefined,
    stores: item.storeName
      ? [{ id: item.storeId ?? undefined, name: item.storeName, address: item.storeAddress ?? undefined }]
      : undefined,
  };
}

export async function getFeedItems(params: GetFeedParams = {}): Promise<Voucher[]> {
  const { pageNumber = 1, pageSize = 50, type, storeId } = params;
  const { data } = await axiosClient.get<{
    data: {
      items: FeedApiItem[];
      pageNumber: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasPrevious: boolean;
      hasNext: boolean;
    };
  }>('/app/feed', {
    params: {
      pageNumber,
      pageSize,
      ...(type && { Type: type }),
      ...(storeId && { StoreId: storeId }),
    },
  });
  return (data.data?.items ?? []).map(mapFeedItemToVoucher);
}

interface RawStoreGroup {
  storeId: string;
  storeName: string;
  storeAddress?: string | null;
  address?: string | null;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
  storeImageUrl: string | null;
  phone?: string | null;
  storePhone?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  workingStatus: string | null;
  items: FeedApiItem[];
}

export async function getFeedGrouped(): Promise<GroupedFeedResult> {
  const { data } = await axiosClient.get<{
    data: {
      globalRewards: FeedApiItem[];
      stores: RawStoreGroup[];
    };
  }>('/app/feed', { params: { Grouped: true } });

  const globalVouchers = (data.data.globalRewards ?? []).map(mapFeedItemToVoucher);
  const stores: StoreGroup[] = (data.data.stores ?? []).map((s) => {
    const firstItem = s.items[0] ?? null;
    return {
      storeId: s.storeId,
      storeName: s.storeName,
      address: s.storeAddress ?? s.address ?? firstItem?.storeAddress ?? null,
      distanceKm: s.distanceKm ?? firstItem?.distanceKm ?? null,
      latitude: s.latitude ?? firstItem?.latitude ?? null,
      longitude: s.longitude ?? firstItem?.longitude ?? null,
      imageUrl: s.storeImageUrl ?? firstItem?.storeImageUrl ?? null,
      phone: s.phone ?? s.storePhone ?? firstItem?.storePhone ?? null,
      openFrom: s.openTime ?? firstItem?.storeOpenTime ?? null,
      openTo: s.closeTime ?? firstItem?.storeCloseTime ?? null,
      workingStatus: s.workingStatus ?? null,
      items: s.items.map(mapFeedItemToVoucher),
    };
  });

  return { globalVouchers, stores };
}
