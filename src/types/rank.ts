export interface AppRank {
  id: string;
  code: string;
  name: string;
  description: string | null;
  customBenefits: string[] | null;
  minTotalSpent: number;
  maxTotalSpent: number;
  priority: number;
  iconUrl: string;
  rewardProductDiscountPercent: number;
  bonusPointCheckinPercent: number;
  rewardExchangeCoinDiscountPercent: number;
  isActive: boolean;
}
