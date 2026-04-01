import { create } from 'zustand';
import { Reward, UserReward, FEED_ITEM_TYPES, StoreGroup, GroupedFeedResult } from '@/types/reward';
import { getFeedItems, getFeedGrouped } from '@/api/feed';
import { getRewardById, getUserRewards, redeemReward } from '@/api/rewards';
import { useUserStore } from '@/store/user';

const USER_REWARDS_PAGE_SIZE = 5;

// itemTypes used to load rewards and store items.
// These are defined here separately; the actual values will be driven by
// Business Logic in the future.
const REWARD_ITEM_TYPES = [FEED_ITEM_TYPES.VOUCHER, FEED_ITEM_TYPES.PHYSICAL_ITEM] as const;
const STORE_ITEM_TYPES  = [FEED_ITEM_TYPES.FNB_PRODUCT] as const;

type RewardsStore = {
  allRewards: Reward[];
  userRewards: UserReward[];
  userRewardsPage: number;
  userRewardsHasMore: boolean;
  userRewardsUnusedCount: number;
  /** Loading flag for allRewards / reward detail / storeGroups */
  loading: boolean;
  /** Loading flag exclusively for userRewards (my-vouchers) */
  userRewardsLoading: boolean;
  selectedReward: Reward | null;
  redeeming: boolean;

  // Grouped (by-store) feed
  globalRewards: Reward[];
  storeGroups: StoreGroup[];
  storeGroupsLoading: boolean;

  loadAllRewards: () => Promise<void>;
  loadRewardById: (id: string) => Promise<void>;
  loadUserRewards: () => Promise<void>;
  loadMoreUserRewards: () => Promise<void>;
  loadStoreGroups: () => Promise<void>;
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
  userRewardsLoading: false,
  selectedReward: null,
  redeeming: false,
  globalRewards: [],
  storeGroups: [],
  storeGroupsLoading: false,

  loadAllRewards: async () => {
    set({ loading: true });
    try {
      const results = await Promise.all([
        ...REWARD_ITEM_TYPES.map((type) =>
          getFeedItems({ pageNumber: 1, pageSize: 50, type }),
        ),
        ...STORE_ITEM_TYPES.map((type) =>
          getFeedItems({ pageNumber: 1, pageSize: 50, type }),
        ),
      ]);
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
    if (get().userRewardsLoading) return;
    set({ userRewardsLoading: true });
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
      set({ userRewardsLoading: false });
    }
  },

  loadMoreUserRewards: async () => {
    const { userRewardsLoading, userRewardsHasMore, userRewardsPage } = get();
    if (userRewardsLoading || !userRewardsHasMore) return;
    set({ userRewardsLoading: true });
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
      set({ userRewardsLoading: false });
    }
  },

  loadStoreGroups: async () => {
    if (get().storeGroupsLoading) return;
    set({ storeGroupsLoading: true });
    try {
      const result: GroupedFeedResult = await getFeedGrouped();
      set({ globalRewards: result.globalRewards, storeGroups: result.stores });
    } catch (error) {
      console.error('Failed to load store groups:', error);
    } finally {
      set({ storeGroupsLoading: false });
    }
  },

  selectReward: (reward) => set({ selectedReward: reward }),

  redeemReward: async (rewardId: string) => {
    set({ redeeming: true });
    try {
      const reward = get().allRewards.find((r) => r.id === rewardId);
      await redeemReward(rewardId, reward?.source === 'StoreItem' ? 'Product' : 'Reward');
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
