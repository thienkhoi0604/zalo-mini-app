export type PointTransactionType = 'Earn' | 'Spend';
export type PointTransactionSourceType = 'Checkin' | 'Redeem' | string;

export interface PointTransaction {
  id: string;
  type: PointTransactionType;
  sourceType: PointTransactionSourceType;
  points: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}
