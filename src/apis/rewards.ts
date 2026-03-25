import { Reward, UserReward } from '@/types/reward';
import rewardsJson from '@/mock/rewards.json';
import rewardDetailJson from '@/mock/reward-detail.json';
import axiosClient from './client';

export enum REWARD_TYPES {
  VOUCHER = 'Voucher',
  PRODUCT = 'PhysicalItem',
}

interface RewardApiItem {
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

export interface GetRewardsParams {
  pageNumber?: number;
  pageSize?: number;
  type?: REWARD_TYPES;
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
    console.warn(
      'Failed to fetch rewards from API, falling back to mock data:',
      error,
    );
    return (rewardsJson.data.items as RewardApiItem[]).map(mapApiItemToReward);
  }
}

export async function getRewardById(id: string): Promise<Reward> {
  try {
    const { data } = await axiosClient.get<{ data: RewardApiItem }>(
      `/Rewards/${id}`,
    );
    return mapApiItemToReward(data.data);
  } catch (error) {
    console.warn(
      'Failed to fetch reward detail from API, falling back to mock data:',
      error,
    );
    return mapApiItemToReward(rewardDetailJson.data as RewardApiItem);
  }
}

export async function getUserRewards(): Promise<UserReward[]> {
  try {
    const { data } = await axiosClient.get<{ data: UserReward[] }>(
      '/Rewards/my-vouchers',
    );
    return data.data;
  } catch (error) {
    console.warn(
      'Failed to fetch user rewards from API, falling back to mock data:',
      error,
    );
    return [];
  }
}

export async function redeemReward(
  rewardId: string,
): Promise<{ pointsDeducted: number }> {
  const { data } = await axiosClient.post<{
    data: { pointsDeducted: number };
  }>('/Rewards/redeem', { rewardId });
  return data.data;
}
