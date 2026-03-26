import React, { FC } from 'react';
import { Box, Page } from 'zmp-ui';
import { Check, Star } from 'lucide-react';
import { useUserStore } from '@/stores/user';
import { PointWallet } from '@/types/point-wallet';
import { RankTier } from '@/types/rank';

// ─── Tier config ───────────────────────────────────────────────────────────────

interface TierConfig extends RankTier {
  gradient: string;
  lightBg: string;
  accentColor: string;
  emoji: string;
}

const RANK_TIERS: TierConfig[] = [
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

// ─── Hero Banner ───────────────────────────────────────────────────────────────

const HeroBanner: FC<{ tier: TierConfig; pointWallet: PointWallet | null }> = ({ tier, pointWallet }) => (
  <Box
    className="rounded-2xl overflow-hidden relative"
    style={{
      background: tier.gradient,
      boxShadow: `0 12px 32px ${tier.color}30, inset 0 1px 0 rgba(255,255,255,0.3)`,
      padding: '22px 20px 22px',
    }}
  >
    {/* Light */}
    <Box
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 60%)',
      }}
    />

    {/* Glow */}
    <Box
      style={{
        position: 'absolute',
        right: 10,
        top: 10,
        width: 80,
        height: 80,
        background: `radial-gradient(circle, ${tier.color}40, transparent 70%)`,
        filter: 'blur(20px)',
      }}
    />

    <Box flex className="items-center justify-between relative">
      <Box>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Hạng hiện tại</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
          {tier.emoji} {tier.name}
        </p>
      </Box>

      <Box
        className="flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.4)',
        }}
      >
        <Star size={28} color="#fff" fill="#fff" />
      </Box>
    </Box>

    {/* Points row */}
    <Box
      flex
      className="items-center"
      style={{
        marginTop: 16,
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 12,
        padding: '10px 14px',
        gap: 10,
      }}
    >
      <Box style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: 10 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>Xu khả dụng</p>
        <Box flex className="items-center" style={{ gap: 5 }}>
          <span style={{ fontSize: 16 }}>🪙</span>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
            {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
      <Box style={{ flex: 1, paddingLeft: 10 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>Đã sử dụng</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
          {(pointWallet?.totalSpent ?? 0).toLocaleString('vi-VN')}
        </p>
      </Box>
    </Box>
  </Box>
);

// ─── Progress ──────────────────────────────────────────────────────────────────

const ProgressSteps: FC<{ currentCode: string }> = ({ currentCode }) => {
  const currentIndex = RANK_TIERS.findIndex((t) => t.code === currentCode);

  return (
    <Box className="bg-white rounded-2xl px-4 py-4">
      <p className="text-xs font-bold text-gray-500 mb-3 uppercase">
        Lộ trình thăng hạng
      </p>

      <Box flex className="items-center">
        {RANK_TIERS.map((tier, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={tier.code}>
              <Box className="flex flex-col items-center">
                <Box
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isCurrent ? 32 : 26,
                    height: isCurrent ? 32 : 26,
                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.3s',
                    background: reached ? tier.gradient : '#E5E7EB',
                  }}
                >
                  {reached ? (
                    <Check size={12} color="#fff" />
                  ) : (
                    <span>{tier.emoji}</span>
                  )}
                </Box>

                <p className="text-[10px] mt-1">{tier.name}</p>
              </Box>

              {i < RANK_TIERS.length - 1 && (
                <Box
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 999,
                    background: i < currentIndex ? tier.gradient : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

// ─── Rank Card ────────────────────────────────────────────────────────────────

const RankCard: FC<{
  tier: TierConfig;
  isCurrent: boolean;
  isPast: boolean;
}> = ({ tier, isCurrent, isPast }) => (
  <Box
    className="rounded-2xl overflow-hidden"
    style={{
      background: '#fff',
      transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
      opacity: isPast ? 0.85 : isCurrent ? 1 : 0.6,
      transition: 'all 0.25s',
      border: isCurrent ? `2px solid ${tier.color}` : '1px solid #eee',
      boxShadow: isCurrent
        ? `0 8px 24px ${tier.color}30`
        : '0 2px 6px rgba(0,0,0,0.05)',
    }}
  >
    {/* Header */}
    <Box
      style={{
        background: tier.gradient,
        padding: '12px 16px',
      }}
    >
      <p style={{ color: '#fff', fontWeight: 700 }}>
        {tier.emoji} {tier.name}
      </p>
    </Box>

    {/* Benefits */}
    <Box className="p-3 flex flex-col gap-2">
      {tier.benefits.map((b, i) => (
        <Box
          key={i}
          className="flex items-center gap-3 rounded-xl px-2 py-2"
          style={{
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span>{b.icon}</span>
          <p className="text-sm font-semibold">{b.label}</p>
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

function resolveCurrentTier(rankCode?: string, rankName?: string): TierConfig {
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

const RankBenefitsPage: FC = () => {
  const { user, pointWallet } = useUserStore();

  const currentTier = resolveCurrentTier(user?.rank?.currentRankCode, user?.rank?.currentRankName);
  const currentCode = currentTier.code;
  const currentIndex = RANK_TIERS.findIndex((t) => t.code === currentCode);

  return (
    <Page
      className="flex-1"
      style={{
        background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
      }}
    >
      <Box className="px-4 pt-4 pb-8 flex flex-col gap-3">
        <HeroBanner tier={currentTier} pointWallet={pointWallet} />
        <ProgressSteps currentCode={currentCode} />

        <p className="text-xs font-bold text-gray-500 uppercase mt-2">
          Đặc quyền
        </p>

        {RANK_TIERS.map((tier, i) => (
          <RankCard
            key={tier.code}
            tier={tier}
            isCurrent={tier.code === currentCode}
            isPast={i < currentIndex}
          />
        ))}
      </Box>
    </Page>
  );
};

export default RankBenefitsPage;
