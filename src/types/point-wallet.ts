export type PointWallet = {
  currentBalance: number;
  lockedBalance: number;
  vehicleStatus: string;
  totalEarned: number;
  totalSpent: number;
  lastEarnedAt: string | null;
  lastSpentAt: string | null;
};
