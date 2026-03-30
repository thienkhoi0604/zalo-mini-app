import { Reward, UserReward, RewardApiItem, GetUserRewardsParams } from '@/types/reward';
import { PaginatedApiResponse } from '@/types/common';
import axiosClient from './client';

function mapApiItemToReward(item: RewardApiItem): Reward {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.type,
    description: item.description ?? '',
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: item.type,
    source: 'Reward',
    pointsRequired: item.pointCost,
    applicableTimeStart: item.validFrom ?? '',
    applicableTimeEnd: item.validTo ?? '',
    programNotes: '',
    usageGuide: '',
    status: item.isActive ? 'active' : 'expired',
    stores: item.storeNames?.map((name) => ({ address: name })),
  };
}

export async function getRewardById(id: string): Promise<Reward | null> {
  try {
    const { data } = await axiosClient.get<{ data: RewardApiItem }>(`/Rewards/${id}`);
    return mapApiItemToReward(data.data);
  } catch {
    return null;
  }
}

export interface UserRewardsResponse extends PaginatedApiResponse<UserReward> {
  unusedCount: number;
}

export async function getUserRewards(
  params: GetUserRewardsParams = {},
): Promise<UserRewardsResponse> {
  const { pageNumber = 1, pageSize = 5 } = params;
  try {
    const { data } = await axiosClient.get<{
      success: boolean;
      data: {
        items: UserReward[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        hasNext: boolean;
      };
    }>('/Rewards/my-vouchers', { params: { pageNumber, pageSize } });
    const items: UserReward[] = data.data.items ?? [];
    return {
      success: true,
      unusedCount: items.filter((v) => v.usedAt === null).length,
      data: {
        items,
        pageNumber: data.data.pageNumber ?? pageNumber,
        pageSize: data.data.pageSize ?? pageSize,
        totalCount: data.data.totalCount ?? items.length,
        hasNext: data.data.hasNext ?? false,
      },
    };
  } catch {
    return {
      success: false,
      unusedCount: 0,
      data: { items: [], pageNumber, pageSize, totalCount: 0, hasNext: false },
    };
  }
}

export type RedeemItemType = 'Reward' | 'Product';

export async function redeemReward(
  rewardId: string,
  itemType: RedeemItemType,
): Promise<{ pointsDeducted: number }> {
  const { data } = await axiosClient.post<{ data: { pointsDeducted: number } }>(
    '/Rewards/redeem',
    { rewardId, itemType },
  );
  return data.data;
}
