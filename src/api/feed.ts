import { FeedApiItem, GetFeedParams, GroupedFeedResult, Voucher, StoreGroup } from '@/types/voucher';
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
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: item.itemTypeTranslate,
    source: item.sourceType,
    brandName: item.storeName ?? undefined,
    costCurrency: isStoreItem ? 'GreenCoin' : 'Points',
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
      ? [{ id: item.storeId ?? undefined, name: item.storeName }]
      : undefined,
  };
}

export async function getFeedItems(params: GetFeedParams = {}): Promise<Voucher[]> {
  const { pageNumber = 1, pageSize = 50, type } = params;
  const { data } = await axiosClient.get<{
    data: { items: FeedApiItem[] };
  }>('/app/feed', {
    params: { pageNumber, pageSize, ...(type && { Type: type }) },
  });
  return (data.data.items ?? []).map(mapFeedItemToVoucher);
}

interface RawStoreGroup {
  storeId: string;
  storeName: string;
  address: string | null;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
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
  const stores: StoreGroup[] = (data.data.stores ?? []).map((s) => ({
    storeId: s.storeId,
    storeName: s.storeName,
    address: s.address ?? null,
    distanceKm: s.distanceKm,
    latitude: s.latitude,
    longitude: s.longitude,
    items: s.items.map(mapFeedItemToVoucher),
  }));

  return { globalVouchers, stores };
}
