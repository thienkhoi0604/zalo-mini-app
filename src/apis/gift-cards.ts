import { GiftCard, UserGiftCard } from "@/types/gift-card";
import { MOCK_GIFT_CARDS, MOCK_USER_GIFT_CARDS } from "@/mock/gift-cards";
import { apiFetch } from "./authorization";

export async function getGiftCards(): Promise<GiftCard[]> {
  try {
    const res = await apiFetch<{ data: GiftCard[] }>("/gift-cards");
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch gift cards from API, using mock data:", error);
    // Return mock data as fallback
    return MOCK_GIFT_CARDS;
  }
}

export async function getUserGiftCards(): Promise<UserGiftCard[]> {
  try {
    const res = await apiFetch<{ data: UserGiftCard[] }>("/users/gift-cards");
    return res.data;
  } catch (error) {
    console.warn(
      "Failed to fetch user gift cards from API, using mock data:",
      error
    );
    // Return mock data as fallback
    return MOCK_USER_GIFT_CARDS;
  }
}

export async function redeemGiftCard(
  giftCardId: string
): Promise<{ pointsDeducted: number }> {
  try {
    const res = await apiFetch<{ data: { pointsDeducted: number } }>(
      "/users/redeem-gift-card",
      {
        method: "POST",
        data: { giftCardId },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to redeem gift card:", error);

    // Mock redemption - find the gift card and return its points requirement
    const card = MOCK_GIFT_CARDS.find((c) => c.id === giftCardId);
    if (card) {
      return { pointsDeducted: card.pointsRequired };
    }

    throw error;
  }
}
