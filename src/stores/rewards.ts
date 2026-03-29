import { create } from 'zustand';
import { Reward, UserReward, REWARD_TYPES } from '@/types/reward';
import { getRewards, getRewardById, getUserRewards, redeemReward } from '@/apis/rewards';
import { getStoreItems } from '@/apis/store-items';
import { useUserStore } from '@/stores/user';

const USER_REWARDS_PAGE_SIZE = 5;

type RewardsStore = {
  allRewards: Reward[];
  userRewards: UserReward[];
  userRewardsPage: number;
  userRewardsHasMore: boolean;
  userRewardsUnusedCount: number;
  loading: boolean;
  selectedReward: Reward | null;
  redeeming: boolean;

  loadAllRewards: () => Promise<void>;
  loadRewardById: (id: string) => Promise<void>;
  /** Load page 1, reset userRewards list */
  loadUserRewards: () => Promise<void>;
  /** Append next page of userRewards */
  loadMoreUserRewards: () => Promise<void>;
  selectReward: (reward: Reward | null) => void;
  redeemReward: (rewardId: string) => Promise<void>;
  getGroupedByCategory: () => Record<string, Reward[]>;
};

export const useRewardsStore = create<RewardsStore>((set, get) => ({
  allRewards: [],
  userRewards: [],
  userRewardsPage: 0,
  userRewardsHasMore: true,
  userRewardsUnusedCount: 0,
  loading: false,
  selectedReward: null,
  redeeming: false,

  loadAllRewards: async () => {
    set({ loading: true });
    try {
      const [storeItems, ...rewardResults] = await Promise.all([
        getStoreItems(1, 50),
        ...Object.values(REWARD_TYPES).map((type) =>
          getRewards({ pageNumber: 1, pageSize: 10, type }),
        ),
      ]);
      const rewards = ([] as Reward[]).concat(...rewardResults);
      set({ allRewards: [...rewards, ...storeItems], loading: false });
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
      if (!reward) {
        set({ loading: false });
        return;
      }
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
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await getUserRewards({ pageNumber: 1, pageSize: USER_REWARDS_PAGE_SIZE });
      set({
        userRewards: res.data.items ?? [],
        userRewardsPage: 1,
        userRewardsHasMore: res.data.hasNext ?? false,
        userRewardsUnusedCount: res.unusedCount,
      });
    } catch (error) {
      console.error('Failed to load user rewards:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadMoreUserRewards: async () => {
    const { loading, userRewardsHasMore, userRewardsPage } = get();
    if (loading || !userRewardsHasMore) return;
    set({ loading: true });
    try {
      const nextPage = userRewardsPage + 1;
      const res = await getUserRewards({ pageNumber: nextPage, pageSize: USER_REWARDS_PAGE_SIZE });
      set((state) => {
        const merged = [...state.userRewards, ...(res.data.items ?? [])];
        return {
          userRewards: merged,
          userRewardsPage: nextPage,
          userRewardsHasMore: res.data.hasNext ?? false,
          userRewardsUnusedCount: merged.filter((v) => v.usedAt === null).length,
        };
      });
    } catch (error) {
      console.error('Failed to load more user rewards:', error);
    } finally {
      set({ loading: false });
    }
  },

  selectReward: (reward) => set({ selectedReward: reward }),

  redeemReward: async (rewardId: string) => {
    set({ redeeming: true });
    try {
      const reward = get().allRewards.find((r) => r.id === rewardId);
      await redeemReward(rewardId, reward?.source === 'product' ? 'Product' : 'Reward');
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
