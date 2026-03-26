import React, { FC } from 'react';
import { Box, Page } from 'zmp-ui';
import { ChevronRight } from 'lucide-react';
import { useUserStore } from '@/stores/user';
import { RankTier } from '@/types/rank';

const RANK_TIERS: RankTier[] = [
  {
    code: 'MEMBER',
    name: 'Hạng Member',
    color: '#9CA3AF',
    benefits: [
      { icon: '💳', label: 'Tích điểm 0,1% giá trị giao dịch' },
      { icon: '🪙', label: 'Nhận ưu đãi cơ bản tại trạm sạc' },
    ],
  },
  {
    code: 'SILVER',
    name: 'Hạng Silver',
    color: '#6B7280',
    benefits: [
      { icon: '💳', label: 'Giảm 0,3% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 0,3% giá trị giao dịch' },
    ],
  },
  {
    code: 'GOLD',
    name: 'Hạng Gold',
    color: '#C49A6C',
    benefits: [
      { icon: '💳', label: 'Giảm 0,5% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 0,5% giá trị giao dịch' },
    ],
  },
  {
    code: 'PLATINUM',
    name: 'Hạng Platinum',
    color: '#4B5563',
    benefits: [
      { icon: '💳', label: 'Giảm 1% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 1% giá trị giao dịch' },
    ],
  },
  {
    code: 'DIAMOND',
    name: 'Hạng Diamond',
    color: '#1D4ED8',
    benefits: [
      { icon: '💳', label: 'Giảm 1,5% giá trị giao dịch' },
      { icon: '🪙', label: 'Tích điểm 1,5% giá trị giao dịch' },
      { icon: '🎁', label: 'Ưu tiên hỗ trợ khách hàng 24/7' },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

const RankCard: FC<{ tier: RankTier; isCurrent: boolean }> = ({ tier, isCurrent }) => (
  <Box
    className="rounded-2xl overflow-hidden bg-white"
    style={{
      border: isCurrent ? `2px solid ${tier.color}` : '1px solid #F0F0F0',
      boxShadow: isCurrent ? `0 4px 16px ${tier.color}33` : '0 1px 4px rgba(0,0,0,0.06)',
    }}
  >
    {/* Rank header */}
    <Box
      flex
      className="items-center px-4 py-3"
      style={{
        borderBottom: '1px solid #F5F5F5',
        gap: 8,
      }}
    >
      <Box
        className="rounded-full flex items-center justify-center"
        style={{ width: 10, height: 10, background: tier.color, flexShrink: 0 }}
      />
      <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{tier.name}</p>
      {isCurrent && (
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            fontWeight: 700,
            background: tier.color,
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 100,
          }}
        >
          Hạng của bạn
        </span>
      )}
    </Box>

    {/* Benefits list */}
    <Box className="px-4 py-2">
      {tier.benefits.map((b, i) => (
        <Box
          key={i}
          flex
          className="items-center py-3"
          style={{
            borderBottom: i < tier.benefits.length - 1 ? '1px solid #F9F9F9' : 'none',
            gap: 14,
          }}
        >
          <Box
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 40, height: 40, background: '#FEF3C7' }}
          >
            <span style={{ fontSize: 20 }}>{b.icon}</span>
          </Box>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: '20px' }}>{b.label}</p>
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RankBenefitsPage: FC = () => {
  const { user } = useUserStore();
  const currentRankCode = user?.rank?.currentRankCode?.toUpperCase() ?? 'MEMBER';

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex-1 overflow-auto px-4 pt-4 pb-8" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Brand card */}
        <Box
          flex
          className="items-center justify-between bg-white rounded-2xl px-4 py-3"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <Box flex className="items-center" style={{ gap: 10 }}>
            <span style={{ fontSize: 28 }}>🌿</span>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>EcoGreen</p>
          </Box>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: 13,
              fontWeight: 600,
              color: '#288F4E',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Xem chính sách
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </Box>

        {/* Rank tiers */}
        {RANK_TIERS.map((tier) => (
          <RankCard
            key={tier.code}
            tier={tier}
            isCurrent={tier.code === currentRankCode}
          />
        ))}
      </Box>
    </Page>
  );
};

export default RankBenefitsPage;
