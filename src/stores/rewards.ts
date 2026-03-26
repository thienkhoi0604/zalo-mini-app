import { create } from 'zustand';
import { Reward, UserReward, REWARD_TYPES } from '@/types/reward';
import { getRewards, getRewardById, getUserRewards, redeemReward } from '@/apis/rewards';
import { useUserStore } from '@/stores/user';

type RewardsStore = {
  allRewards: Reward[];
  userRewards: UserReward[];
  loading: boolean;
  selectedReward: Reward | null;
  redeeming: boolean;

  loadAllRewards: () => Promise<void>;
  loadRewardById: (id: string) => Promise<void>;
  loadUserRewards: () => Promise<void>;
  selectReward: (reward: Reward | null) => void;
  redeemReward: (rewardId: string) => Promise<void>;
  getGroupedByCategory: () => Record<string, Reward[]>;
};

export const useRewardsStore = create<RewardsStore>((set, get) => ({
  allRewards: [],
  userRewards: [],
  loading: false,
  selectedReward: null,
  redeeming: false,

  loadAllRewards: async () => {
    set({ loading: true });
    try {
      const results = await Promise.all(
        Object.values(REWARD_TYPES).map((type) =>
          getRewards({ pageNumber: 1, pageSize: 10, type }),
        ),
      );
      set({ allRewards: ([] as Reward[]).concat(...results), loading: false });
    } catch (error) {
      console.error('Failed to load rewards:', error);
      set({ loading: false });
      throw error;
    }
  },

  loadRewardById: async (id: string) => {
    set({ loading: true });
    try {
      const existing = get().allRewards.find((r) => r.id === id);
      if (existing) {
        set({ loading: false });
        return;
      }
      const reward = await getRewardById(id);
      set((state) => ({
        allRewards: [...state.allRewards, reward],
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load reward detail:', error);
      set({ loading: false });
      throw error;
    }
  },

  loadUserRewards: async () => {
    try {
      const userRewards = await getUserRewards();
      set({ userRewards });
    } catch (error) {
      console.error('Failed to load user rewards:', error);
      throw error;
    }
  },

  selectReward: (reward) => set({ selectedReward: reward }),

  redeemReward: async (rewardId: string) => {
    set({ redeeming: true });
    try {
      await redeemReward(rewardId);
      await Promise.all([
        get().loadUserRewards(),
        useUserStore.getState().loadPointWallet(),
      ]);
      set({ redeeming: false });
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      set({ redeeming: false });
      throw error;
    }
  },

  getGroupedByCategory: () => {
    const grouped: Record<string, Reward[]> = {};
    get().allRewards.forEach((reward) => {
      if (!grouped[reward.category]) grouped[reward.category] = [];
      grouped[reward.category].push(reward);
    });
    return grouped;
  },
}));
