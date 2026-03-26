import { Reward, UserReward, RewardApiItem, GetRewardsParams, GetUserRewardsParams, REWARD_TYPES } from '@/types/reward';
import { PaginatedApiResponse } from '@/types/common';
import rewardsJson from '@/mock/rewards.json';
import rewardDetailJson from '@/mock/reward-detail.json';
import myVouchersJson from '@/mock/my-vouchers.json';
import axiosClient from './client';

function mapApiItemToReward(item: RewardApiItem): Reward {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description ?? '',
    thumbnailImageUrl: item.imageUrl,
    bannerImageUrl: item.imageUrl,
    category: item.type,
    pointsRequired: item.pointCost,
    applicableTimeStart: item.validFrom ?? '',
    applicableTimeEnd: item.validTo ?? '',
    programNotes: '',
    usageGuide: '',
    status: item.isActive ? 'active' : 'expired',
    stores: item.storeNames?.map((name) => ({ address: name })),
  };
}

export async function getRewards(params: GetRewardsParams = {}): Promise<Reward[]> {
  try {
    const { pageNumber = 1, pageSize = 10, type } = params;
    const { data } = await axiosClient.get<{
      data: { items: RewardApiItem[] };
    }>('/Rewards', {
      params: { pageNumber, pageSize, ...(type && { type }) },
    });
    return (data.data.items ?? []).map(mapApiItemToReward);
  } catch (error) {
    console.warn('Failed to fetch rewards from API, falling back to mock data:', error);
    return (rewardsJson.data.items as RewardApiItem[]).map(mapApiItemToReward);
  }
}

export async function getRewardById(id: string): Promise<Reward> {
  try {
    const { data } = await axiosClient.get<{ data: RewardApiItem }>(`/Rewards/${id}`);
    return mapApiItemToReward(data.data);
  } catch (error) {
    console.warn('Failed to fetch reward detail from API, falling back to mock data:', error);
    return mapApiItemToReward(rewardDetailJson.data as RewardApiItem);
  }
}

export async function getUserRewards(
  params: GetUserRewardsParams = {},
): Promise<PaginatedApiResponse<UserReward>> {
  const { pageNumber = 1, pageSize = 5 } = params;
  try {
    const { data } = await axiosClient.get<PaginatedApiResponse<UserReward>>(
      '/Rewards/my-vouchers',
      { params: { pageNumber, pageSize } },
    );
    return data;
  } catch (error) {
    console.warn('Failed to fetch user rewards from API, falling back to mock data:', error);
    const all = myVouchersJson.data as UserReward[];
    const start = (pageNumber - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
      success: true,
      data: {
        items,
        pageNumber,
        pageSize,
        totalCount: all.length,
        hasNext: start + pageSize < all.length,
      },
    };
  }
}

export async function redeemReward(rewardId: string): Promise<{ pointsDeducted: number }> {
  const { data } = await axiosClient.post<{ data: { pointsDeducted: number } }>(
    '/Rewards/redeem',
    { rewardId },
  );
  return data.data;
}
