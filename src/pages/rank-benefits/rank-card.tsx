import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { TierConfig } from './tiers';
import logoImg from '@/assets/images/logo.png';

interface Props {
  tier: TierConfig;
  isCurrent: boolean;
  isPast: boolean;
}

const formatSpent = (value: number) =>
  value > 0 ? value.toLocaleString('vi-VN') + ' GreenCoin' : null;

const RankCard: FC<Props> = ({ tier, isCurrent, isPast }) => {
  const spentRange = tier.maxTotalSpent > 0
    ? `${formatSpent(tier.minTotalSpent)} – ${formatSpent(tier.maxTotalSpent)}`
    : `Từ ${formatSpent(tier.minTotalSpent)} trở lên`;

  return (
    <Box
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        opacity: isPast ? 0.75 : isCurrent ? 1 : 0.6,
        transition: 'all 0.25s',
        background: '#fff',
        border: isCurrent ? `1.5px solid ${tier.color}` : '1px solid #E5E7EB',
        boxShadow: isCurrent
          ? `0 8px 24px ${tier.color}25`
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Left accent bar ── */}
      <Box
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 4,
          background: tier.gradient,
          opacity: isCurrent ? 1 : 0.6,
        }}
      />

      <Box style={{ padding: '14px 16px 14px 20px' }}>

        {/* ── Header row: icon + name + badge ── */}
        <Box flex className="items-center" style={{ gap: 12, marginBottom: 10 }}>
          {/* Rank icon */}
          <Box
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${tier.color}20, ${tier.color}0D)`,
              border: `1px solid ${tier.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {tier.iconUrl ? (
              <img
                src={tier.iconUrl}
                alt={tier.name}
                style={{ width: 28, height: 28, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
              />
            ) : (
              <span style={{ fontSize: 22 }}>{tier.emoji}</span>
            )}
          </Box>

          {/* Name + description */}
          <Box style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: '#111827',
                lineHeight: 1.2,
              }}
            >
              {tier.name}
            </p>
            {tier.description ? (
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                {tier.description}
              </p>
            ) : null}
          </Box>

          {/* Current badge */}
          {isCurrent && (
            <Box
              style={{
                flexShrink: 0,
                background: tier.gradient,
                borderRadius: 100,
                padding: '4px 10px',
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
                Hạng của bạn
              </p>
            </Box>
          )}
        </Box>

        {/* ── Spending range ── */}
        <Box
          style={{
            marginBottom: 10,
            padding: '6px 10px',
            borderRadius: 8,
            background: tier.lightBg,
            border: `1px solid ${tier.color}20`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 12 }}>💳</span>
          <p style={{ fontSize: 11, fontWeight: 600, color: tier.accentColor, letterSpacing: 0.2 }}>
            {spentRange}
          </p>
        </Box>

        {/* ── Divider ── */}
        <Box style={{ height: 1, background: '#F3F4F6', marginBottom: 10 }} />

        {/* ── Benefits ── */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tier.benefits.map((b, i) => (
            <Box key={i} flex className="items-center" style={{ gap: 10 }}>
              <Box
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: tier.lightBg,
                  border: `1px solid ${tier.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                }}
              >
                {b.icon}
              </Box>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                {b.label}
              </p>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default RankCard;
