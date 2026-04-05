import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Check } from 'lucide-react';
import { TierConfig } from './tiers';
import { UserRank } from '@/types/user';
import CoinIcon from '@/components/ui/coin-icon';

interface Props {
  tiers: TierConfig[];
  currentCode: string;
  userRank?: UserRank;
}

const ProgressSteps: FC<Props> = ({ tiers, currentCode, userRank }) => {
  const sorted = [...tiers].sort((a, b) => a.priority - b.priority);
  const currentIndex = sorted.findIndex((t) => t.code === currentCode);
  const currentTier = sorted[currentIndex];

  const percent = userRank?.progressToNextPercent ?? 0;
  const pointsToNext = userRank?.pointsToNext ?? 0;
  const nextTier = sorted[currentIndex + 1];
  const hasNext = !!nextTier;

  return (
    <Box
      style={{
        borderRadius: 20,
        padding: '14px 16px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#9CA3AF',
          marginBottom: 14,
        }}
      >
        Lộ trình thăng hạng
      </p>

      {/* Step circles + connectors */}
      <Box flex className="items-center">
        {sorted.map((tier, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={tier.code}>
              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                {/* Step circle */}
                <Box
                  style={{
                    width: isCurrent ? 34 : 28,
                    height: isCurrent ? 34 : 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                    background: reached ? tier.gradient : '#E5E7EB',
                    boxShadow: isCurrent ? `0 0 10px ${tier.color}50` : 'none',
                  }}
                >
                  {reached
                    ? <Check size={13} color="#fff" strokeWidth={2.5} />
                    : <span style={{ fontSize: 13 }}>{tier.emoji}</span>
                  }
                </Box>

                {/* Tier name */}
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? '#111827' : '#9CA3AF',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.name}
                </p>
              </Box>

              {/* Connector line */}
              {i < sorted.length - 1 && (
                <Box
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 999,
                    marginBottom: 16,
                    background: i < currentIndex ? tier.gradient : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Progress to next rank */}
      {hasNext && currentTier && (
        <Box style={{ marginTop: 14 }}>
          {/* Progress bar */}
          <Box
            style={{
              height: 7,
              borderRadius: 999,
              background: '#F3F4F6',
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <Box
              style={{
                height: '100%',
                width: `${Math.min(percent, 100)}%`,
                borderRadius: 999,
                background: currentTier.gradient,
                transition: 'width 0.6s ease',
              }}
            />
          </Box>

          {/* Percentage + points label */}
          <Box flex className="items-center justify-between">
            <Box flex className="items-center" style={{ gap: 4 }}>
              <CoinIcon size={13} />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                Cần thêm{' '}
                <span style={{ color: currentTier.color }}>
                  {pointsToNext.toLocaleString('vi-VN')}
                </span>{' '}
                điểm
              </p>
            </Box>
            <p style={{ fontSize: 12, fontWeight: 800, color: currentTier.color }}>
              {percent.toFixed(1)}%
            </p>
          </Box>

          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>
            để đạt hạng <span style={{ fontWeight: 700, color: '#374151' }}>{nextTier.name}</span>
          </p>
        </Box>
      )}
    </Box>
  );
};

export default ProgressSteps;
