import { FeedApiItem, GetFeedParams, GroupedFeedResult, Reward, StoreGroup } from '@/types/reward';
import axiosClient from './client';

export function mapFeedItemToReward(item: FeedApiItem): Reward {
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

export async function getFeedItems(params: GetFeedParams = {}): Promise<Reward[]> {
  const { pageNumber = 1, pageSize = 50, itemType } = params;
  const { data } = await axiosClient.get<{
    data: { items: FeedApiItem[] };
  }>('/app/feed', {
    params: { pageNumber, pageSize, ...(itemType && { itemType }) },
  });
  return (data.data.items ?? []).map(mapFeedItemToReward);
}

interface RawStoreGroup {
  storeId: string;
  storeName: string;
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

  const globalRewards = (data.data.globalRewards ?? []).map(mapFeedItemToReward);
  const stores: StoreGroup[] = (data.data.stores ?? []).map((s) => ({
    storeId: s.storeId,
    storeName: s.storeName,
    distanceKm: s.distanceKm,
    latitude: s.latitude,
    longitude: s.longitude,
    items: s.items.map(mapFeedItemToReward),
  }));

  return { globalRewards, stores };
}
