import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { TierConfig } from './tiers';

interface Props {
  tier: TierConfig;
  isCurrent: boolean;
  isPast: boolean;
}

const formatSpent = (value: number) =>
  value > 0 ? value.toLocaleString('vi-VN') + ' xu' : null;

const RankCard: FC<Props> = ({ tier, isCurrent, isPast }) => {
  const spentRange = tier.maxTotalSpent > 0
    ? `${formatSpent(tier.minTotalSpent)} – ${formatSpent(tier.maxTotalSpent)}`
    : `Từ ${formatSpent(tier.minTotalSpent)} trở lên`;

  return (
    <Box
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#fff',
        transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
        opacity: isPast ? 0.85 : isCurrent ? 1 : 0.6,
        transition: 'all 0.25s',
        border: isCurrent ? `2px solid ${tier.color}` : '1px solid #eee',
        boxShadow: isCurrent ? `0 8px 24px ${tier.color}30` : '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <Box
        style={{
          background: tier.gradient,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {tier.emoji} {tier.name}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 }}>
            {tier.description}
          </p>
        </Box>
        {isCurrent && (
          <Box
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 100,
              padding: '3px 10px',
            }}
          >
            <p style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>Hạng của bạn</p>
          </Box>
        )}
      </Box>

      {/* Spending range */}
      <Box
        style={{
          background: tier.lightBg,
          padding: '6px 16px',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <p style={{ fontSize: 11, color: tier.accentColor, fontWeight: 600 }}>
          💳 {spentRange}
        </p>
      </Box>

      {/* Benefits */}
      <Box className="p-3 flex flex-col gap-2">
        {tier.benefits.map((b, i) => (
          <Box
            key={i}
            className="flex items-center gap-3 rounded-xl px-2 py-2"
            style={{ background: tier.lightBg }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
            <p style={{ fontSize: 13, fontWeight: 600, color: tier.accentColor }}>{b.label}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RankCard;
