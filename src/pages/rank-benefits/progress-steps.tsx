import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Check } from 'lucide-react';
import { TierConfig } from './tiers';

interface Props {
  tiers: TierConfig[];
  currentCode: string;
}

const ProgressSteps: FC<Props> = ({ tiers, currentCode }) => {
  const sorted = [...tiers].sort((a, b) => a.priority - b.priority);
  const currentIndex = sorted.findIndex((t) => t.code === currentCode);

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
    </Box>
  );
};

export default ProgressSteps;
