import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { TierConfig } from './tiers';

interface Props {
  tier: TierConfig;
  isCurrent: boolean;
  isPast: boolean;
}

const RankCard: FC<Props> = ({ tier, isCurrent, isPast }) => (
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
    <Box style={{ background: tier.gradient, padding: '12px 16px' }}>
      <p style={{ color: '#fff', fontWeight: 700 }}>{tier.emoji} {tier.name}</p>
    </Box>

    <Box className="p-3 flex flex-col gap-2">
      {tier.benefits.map((b, i) => (
        <Box
          key={i}
          className="flex items-center gap-3 rounded-xl px-2 py-2"
          style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <span>{b.icon}</span>
          <p className="text-sm font-semibold">{b.label}</p>
        </Box>
      ))}
    </Box>
  </Box>
);

export default RankCard;
