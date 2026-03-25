import { create } from "zustand";
import { Reward, UserReward } from "@/types/reward";
import { getRewards, getRewardById, getUserRewards, redeemReward } from "apis/rewards";
import { useUserStore } from "./user";

type RewardsStore = {
  // State
  allRewards: Reward[];
  userRewards: UserReward[];
  loading: boolean;
  selectedReward: Reward | null;
  redeeming: boolean;

  // Actions
  loadAllRewards: () => Promise<void>;
  loadRewardById: (id: string) => Promise<void>;
  loadUserRewards: () => Promise<void>;
  selectReward: (card: Reward | null) => void;
  redeemReward: (rewardId: string) => Promise<void>;

  // Computed
  getGroupedByCategory: () => Record<string, Reward[]>;
  getUserRewardDetails: (userRewardId: string) => Reward | null;
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
      const cards = await getRewards();
      set({ allRewards: cards, loading: false });
    } catch (error) {
      console.error("Failed to load rewards:", error);
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
      const cards = await getUserRewards();
      set({ userRewards: cards });
    } catch (error) {
      console.error("Failed to load user rewards:", error);
      throw error;
    }
  },

  selectReward: (card) => set({ selectedReward: card }),

  redeemReward: async (rewardId: string) => {
    set({ redeeming: true });
    try {
      const result = await redeemReward(rewardId);

      const user = useUserStore.getState().user;
      if (user) {
        useUserStore.setState({
          user: {
            ...user,
            points: (user.points || 0) - result.pointsDeducted,
          },
        });
      }

      await get().loadUserRewards();
      set({ redeeming: false });
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      set({ redeeming: false });
      throw error;
    }
  },

  getGroupedByCategory: () => {
    const cards = get().allRewards;
    const grouped: Record<string, Reward[]> = {};

    cards.forEach((card) => {
      if (!grouped[card.category]) {
        grouped[card.category] = [];
      }
      grouped[card.category].push(card);
    });

    return grouped;
  },

  getUserRewardDetails: (userRewardId: string) => {
    const userCard = get().userRewards.find((c) => c.id === userRewardId);
    if (!userCard) return null;

    return get().allRewards.find((c) => c.id === userCard.rewardId) || null;
  },
}));
