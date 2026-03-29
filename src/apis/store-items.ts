import axiosClient from './client';
import { Reward, StoreItemApiItem, getStoreItemTypeLabel } from '@/types/reward';
import mockStoreItems from '@/mock/store-items.json';

function mapStoreItemToReward(item: StoreItemApiItem): Reward {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: String(item.type),
    description: item.description ?? '',
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: getStoreItemTypeLabel(item.type),
    source: 'product',
    brandName: item.storeName,
    pointsRequired: item.coinCost,
    applicableTimeStart: '',
    applicableTimeEnd: '',
    programNotes: '',
    usageGuide: '',
    status: 'active',
  };
}

export async function getStoreItems(pageNumber = 1, pageSize = 10): Promise<Reward[]> {
  try {
    const { data } = await axiosClient.get<{ data: { items: StoreItemApiItem[] } }>(
      '/app/store-items',
      { params: { pageNumber, pageSize } },
    );
    return (data.data.items ?? []).map(mapStoreItemToReward);
  } catch {
    return (mockStoreItems.data.items as StoreItemApiItem[]).map(mapStoreItemToReward);
  }
}
