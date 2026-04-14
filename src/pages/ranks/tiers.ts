import { AppRank } from '@/types/rank';

export interface TierConfig {
  code: string;
  name: string;
  description: string;
  minTotalSpent: number;
  maxTotalSpent: number;
  priority: number;
  iconUrl: string;
  // Visual styling
  color: string;
  gradient: string;
  lightBg: string;
  accentColor: string;
  emoji: string;
  // Derived benefits
  benefits: { icon: string; label: string }[];
}

// ─── Visual config per rank code ─────────────────────────────────────────────

interface VisualConfig {
  color: string;
  gradient: string;
  lightBg: string;
  accentColor: string;
  emoji: string;
}

const VISUAL_BY_CODE: Record<string, VisualConfig> = {
  BRONZE: {
    color: '#CD7F32',
    gradient: 'linear-gradient(135deg, #E8C49A, #CD7F32)',
    lightBg: '#FDF6EE',
    accentColor: '#A0622A',
    emoji: '🥉',
  },
  SILVER: {
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #E5E7EB, #6B7280)',
    lightBg: '#F3F4F6',
    accentColor: '#4B5563',
    emoji: '🥈',
  },
  GOLD: {
    color: '#C49A6C',
    gradient: 'linear-gradient(135deg, #E8CFA0, #B4884F)',
    lightBg: '#FEF9EF',
    accentColor: '#A0784A',
    emoji: '🥇',
  },
  PLATINUM: {
    color: '#4B5563',
    gradient: 'linear-gradient(135deg, #9CA3AF, #374151)',
    lightBg: '#F3F4F6',
    accentColor: '#1F2937',
    emoji: '💎',
  },
  DIAMOND: {
    color: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #93C5FD, #1D4ED8)',
    lightBg: '#EFF6FF',
    accentColor: '#1E40AF',
    emoji: '👑',
  },
};

const DEFAULT_VISUAL: VisualConfig = {
  color: '#6B7280',
  gradient: 'linear-gradient(135deg, #D1D5DB, #6B7280)',
  lightBg: '#F9FAFB',
  accentColor: '#374151',
  emoji: '⭐',
};

// ─── Builder ─────────────────────────────────────────────────────────────────

export function buildTierConfig(rank: AppRank): TierConfig {
  const visual = VISUAL_BY_CODE[rank.code.toUpperCase()] ?? DEFAULT_VISUAL;

  const benefits: { icon: string; label: string }[] = [
    { icon: '🏷️', label: `Giảm ${rank.rewardProductDiscountPercent}% khi đổi voucher` },
    { icon: '⚡', label: `Lá bonus +${rank.bonusPointCheckinPercent}%` },
    { icon: '🪙', label: `Giảm ${rank.rewardExchangeCoinDiscountPercent}% khi đổi GreenCoin` },
  ];

  return {
    code: rank.code,
    name: rank.name,
    description: rank.description,
    minTotalSpent: rank.minTotalSpent,
    maxTotalSpent: rank.maxTotalSpent,
    priority: rank.priority,
    iconUrl: rank.iconUrl,
    ...visual,
    benefits,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function resolveCurrentTier(tiers: TierConfig[], rankCode?: string, rankName?: string): TierConfig | null {
  if (!tiers.length) return null;

  if (rankCode) {
    const byCode = tiers.find(
      (t) => t.code.toUpperCase() === rankCode.toUpperCase() ||
             t.name.toUpperCase() === rankCode.toUpperCase(),
    );
    if (byCode) return byCode;
  }

  if (rankName) {
    const byName = tiers.find(
      (t) => t.name.toUpperCase() === rankName.toUpperCase() ||
             t.code.toUpperCase() === rankName.toUpperCase(),
    );
    if (byName) return byName;
  }

  // Fallback: lowest priority tier
  return tiers.reduce((lowest, t) => t.priority < lowest.priority ? t : lowest, tiers[0]);
}
