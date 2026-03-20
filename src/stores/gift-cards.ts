import { create } from "zustand";
import { GiftCard, UserGiftCard } from "@/types/gift-card";
import { getGiftCards, getUserGiftCards, redeemGiftCard } from "apis/gift-cards";
import { useUserStore } from "./user";

type GiftCardsStore = {
  // State
  allGiftCards: GiftCard[];
  userGiftCards: UserGiftCard[];
  loading: boolean;
  selectedGiftCard: GiftCard | null;
  redeeming: boolean;

  // Actions
  loadAllGiftCards: () => Promise<void>;
  loadUserGiftCards: () => Promise<void>;
  selectGiftCard: (card: GiftCard | null) => void;
  redeemGiftCard: (giftCardId: string) => Promise<void>;

  // Computed
  getGroupedByCategory: () => Record<string, GiftCard[]>;
  getUserGiftCardDetails: (userGiftCardId: string) => GiftCard | null;
};

export const useGiftCardsStore = create<GiftCardsStore>((set, get) => ({
  allGiftCards: [],
  userGiftCards: [],
  loading: false,
  selectedGiftCard: null,
  redeeming: false,

  loadAllGiftCards: async () => {
    set({ loading: true });
    try {
      const cards = await getGiftCards();
      set({ allGiftCards: cards, loading: false });
    } catch (error) {
      console.error("Failed to load gift cards:", error);
      set({ loading: false });
      throw error;
    }
  },

  loadUserGiftCards: async () => {
    try {
      const cards = await getUserGiftCards();
      set({ userGiftCards: cards });
    } catch (error) {
      console.error("Failed to load user gift cards:", error);
      throw error;
    }
  },

  selectGiftCard: (card) => set({ selectedGiftCard: card }),

  redeemGiftCard: async (giftCardId: string) => {
    set({ redeeming: true });
    try {
      const result = await redeemGiftCard(giftCardId);

      const user = useUserStore.getState().user;
      if (user) {
        useUserStore.setState({
          user: {
            ...user,
            points: (user.points || 0) - result.pointsDeducted,
          },
        });
      }

      await get().loadUserGiftCards();
      set({ redeeming: false });
    } catch (error) {
      console.error("Failed to redeem gift card:", error);
      set({ redeeming: false });
      throw error;
    }
  },

  getGroupedByCategory: () => {
    const cards = get().allGiftCards;
    const grouped: Record<string, GiftCard[]> = {};

    cards.forEach((card) => {
      if (!grouped[card.category]) {
        grouped[card.category] = [];
      }
      grouped[card.category].push(card);
    });

    return grouped;
  },

  getUserGiftCardDetails: (userGiftCardId: string) => {
    const userCard = get().userGiftCards.find((c) => c.id === userGiftCardId);
    if (!userCard) return null;

    return get().allGiftCards.find((c) => c.id === userCard.giftCardId) || null;
  },
}));
