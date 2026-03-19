export interface GiftCard {
  id: string;
  code: string;
  name: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  category: string;
  pointsRequired: number;
  applicableTimeStart: string;
  applicableTimeEnd: string;
  programNotes: string;
  usageGuide: string;
  status: "active" | "expired";
}

export interface UserGiftCard {
  id: string;
  giftCardId: string;
  status: "redeemed" | "received";
  redeemedAt?: string;
  receivedAt?: string;
}

export interface GiftCardsFilter {
  category?: string;
  search?: string;
}
