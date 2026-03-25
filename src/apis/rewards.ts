import { Reward, UserReward } from '@/types/reward';
import { MOCK_REWARDS, MOCK_USER_REWARDS } from '@/mock/rewards';
import axiosClient from './client';

export async function getRewards(): Promise<Reward[]> {
  try {
    const { data } = await axiosClient.get<{ data: Reward[] }>('/Rewards');
    return data.data;
  } catch (error) {
    console.warn(
      'Failed to fetch rewards from API, falling back to mock data:',
      error,
    );
    return MOCK_REWARDS;
  }
}

export async function getUserRewards(): Promise<UserReward[]> {
  try {
    const { data } = await axiosClient.get<{ data: UserReward[] }>(
      '/users/rewards',
    );
    return data.data;
  } catch (error) {
    console.warn(
      'Failed to fetch user rewards from API, falling back to mock data:',
      error,
    );
    return MOCK_USER_REWARDS;
  }
}

export async function redeemReward(
  rewardId: string,
): Promise<{ pointsDeducted: number }> {
  try {
    const { data } = await axiosClient.post<{
      data: { pointsDeducted: number };
    }>('/users/redeem-reward', { rewardId });
    return data.data;
  } catch (error) {
    console.error('Failed to redeem reward:', error);

    const card = MOCK_REWARDS.find((c) => c.id === rewardId);
    if (card) {
      return { pointsDeducted: card.pointsRequired };
    }

    throw error;
  }
}
