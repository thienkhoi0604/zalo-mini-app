export interface RewardStore {
  address: string;
}

export interface Reward {
  id: string;
  code: string;
  name: string;
  description: string;
  bannerImageUrl: string;
  thumbnailImageUrl: string;
  category: string;
  brandName?: string;
  brandLogoUrl?: string;
  stores?: RewardStore[];
  terms?: string;
  pointsRequired: number;
  applicableTimeStart: string;
  applicableTimeEnd: string;
  programNotes: string;
  usageGuide: string;
  status: 'active' | 'expired';
}

export interface UserReward {
  id: string;
  rewardId: string;
  status: 'redeemed' | 'received';
  redeemedAt?: string;
  receivedAt?: string;
}

export interface RewardsFilter {
  category?: string;
  search?: string;
}
