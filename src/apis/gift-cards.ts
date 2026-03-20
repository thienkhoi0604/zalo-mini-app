import { GiftCard, UserGiftCard } from '@/types/gift-card';
import { MOCK_GIFT_CARDS, MOCK_USER_GIFT_CARDS } from '@/mock/gift-cards';
import axiosClient from './client';

export async function getGiftCards(): Promise<GiftCard[]> {
  try {
    const { data } = await axiosClient.get<{ data: GiftCard[] }>('/gift-cards');
    return data.data;
  } catch (error) {
    console.warn(
      'Failed to fetch gift cards from API, falling back to mock data:',
      error,
    );
    return MOCK_GIFT_CARDS;
  }
}

export async function getUserGiftCards(): Promise<UserGiftCard[]> {
  try {
    const { data } = await axiosClient.get<{ data: UserGiftCard[] }>(
      '/users/gift-cards',
    );
    return data.data;
  } catch (error) {
    console.warn(
      'Failed to fetch user gift cards from API, falling back to mock data:',
      error,
    );
    return MOCK_USER_GIFT_CARDS;
  }
}

export async function redeemGiftCard(
  giftCardId: string,
): Promise<{ pointsDeducted: number }> {
  try {
    const { data } = await axiosClient.post<{
      data: { pointsDeducted: number };
    }>('/users/redeem-gift-card', { giftCardId });
    return data.data;
  } catch (error) {
    console.error('Failed to redeem gift card:', error);

    const card = MOCK_GIFT_CARDS.find((c) => c.id === giftCardId);
    if (card) {
      return { pointsDeducted: card.pointsRequired };
    }

    throw error;
  }
}
