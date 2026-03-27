import { RankTier } from '@/types/rank';

export interface TierConfig extends RankTier {
  gradient: string;
  lightBg: string;
  accentColor: string;
  emoji: string;
}

export const RANK_TIERS: TierConfig[] = [
  {
    code: 'MEMBER',
    name: 'Bronze',
    emoji: '🥉',
    color: '#CD7F32',
    gradient: 'linear-gradient(135deg, #E8C49A, #CD7F32)',
    lightBg: '#FDF6EE',
    accentColor: '#A0622A',
    benefits: [
      { icon: '💳', label: 'Tích điểm 0,1% giá trị giao dịch' },
      { icon: '🪙', label: 'Nhận ưu đãi cơ bản tại trạm sạc' },
    ],
  },
  {
    code: 'SILVER',
    name: 'Silver',
    emoji: '🥈',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #E5E7EB, #6B7280)',
    lightBg: '#F3F4F6',
    accentColor: '#4B5563',
    benefits: [
      { icon: '💳', label: 'Giảm 0,3% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 0,3% giá trị giao dịch' },
    ],
  },
  {
    code: 'GOLD',
    name: 'Gold',
    emoji: '🥇',
    color: '#C49A6C',
    gradient: 'linear-gradient(135deg, #E8CFA0, #B4884F)',
    lightBg: '#FEF9EF',
    accentColor: '#A0784A',
    benefits: [
      { icon: '💳', label: 'Giảm 0,5% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 0,5% giá trị giao dịch' },
    ],
  },
  {
    code: 'PLATINUM',
    name: 'Platinum',
    emoji: '💎',
    color: '#4B5563',
    gradient: 'linear-gradient(135deg, #9CA3AF, #374151)',
    lightBg: '#F3F4F6',
    accentColor: '#1F2937',
    benefits: [
      { icon: '💳', label: 'Giảm 1% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 1% giá trị giao dịch' },
    ],
  },
  {
    code: 'DIAMOND',
    name: 'Diamond',
    emoji: '👑',
    color: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #93C5FD, #1D4ED8)',
    lightBg: '#EFF6FF',
    accentColor: '#1E40AF',
    benefits: [
      { icon: '💳', label: 'Giảm 1,5% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 1,5% giá trị giao dịch' },
      { icon: '🎁', label: 'Ưu tiên hỗ trợ khách hàng 24/7' },
    ],
  },
];

export function resolveCurrentTier(rankCode?: string, rankName?: string): TierConfig {
  if (import.meta.env.DEV) {
    console.log('[RankBenefits] currentRankCode:', rankCode, '| currentRankName:', rankName);
  }
  if (rankCode) {
    const byCode = RANK_TIERS.find(
      (t) => t.code === rankCode.toUpperCase() || t.name.toUpperCase() === rankCode.toUpperCase(),
    );
    if (byCode) return byCode;
  }
  if (rankName) {
    const byName = RANK_TIERS.find(
      (t) => t.name.toUpperCase() === rankName.toUpperCase() || t.code === rankName.toUpperCase(),
    );
    if (byName) return byName;
  }
  return RANK_TIERS[0];
}
