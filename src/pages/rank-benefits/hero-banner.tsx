import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Star } from 'lucide-react';
import { PointWallet } from '@/types/point-wallet';
import { TierConfig } from './tiers';
import CoinIcon from '@/components/ui/coin-icon';

interface Props {
  tier: TierConfig;
  pointWallet: PointWallet | null;
}

const HeroBanner: FC<Props> = ({ tier, pointWallet }) => (
  <Box
    className="rounded-2xl overflow-hidden relative"
    style={{
      background: tier.gradient,
      boxShadow: `0 12px 32px ${tier.color}30, inset 0 1px 0 rgba(255,255,255,0.3)`,
      padding: '22px 20px',
    }}
  >
    <Box
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 60%)' }}
    />
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
        {tier.description ? (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            {tier.description}
          </p>
        ) : null}
      </Box>

      <Box
        className="flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: 64,
          height: 64,
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.4)',
          flexShrink: 0,
        }}
      >
        {tier.iconUrl ? (
          <img src={tier.iconUrl} alt={tier.name} style={{ width: 44, height: 44, objectFit: 'contain' }} />
        ) : (
          <Star size={28} color="#fff" fill="#fff" />
        )}
      </Box>
    </Box>

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
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>GreenCoin</p>
        <Box flex className="items-center" style={{ gap: 5 }}>
          <CoinIcon size={20} />
          <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
            {(pointWallet?.greenCoin ?? 0).toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
      <Box style={{ flex: 1, paddingLeft: 10 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>GreenCoin</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
          {(pointWallet?.totalSpent ?? 0).toLocaleString('vi-VN')}
        </p>
      </Box>
    </Box>
  </Box>
);

export default HeroBanner;
