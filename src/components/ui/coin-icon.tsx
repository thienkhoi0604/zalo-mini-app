import React, { FC } from 'react';
import { useUserStore } from '@/store/user';
import coinGold from '@/assets/images/coin-gold.png';
// import coinSilver from '@/assets/images/coin-silver.png';
// import coinPlatinum from '@/assets/images/coin-platinum.png';

function getCoinImage(rankCode?: string): string {
  switch (rankCode?.toUpperCase()) {
    // case 'SILVER':   return coinSilver;
    case 'GOLD':     return coinGold;
    // case 'PLATINUM': return coinPlatinum;
    default:         return coinGold;
  }
}

interface CoinIconProps {
  size?: number;
  style?: React.CSSProperties;
}

const CoinIcon: FC<CoinIconProps> = ({ size = 16, style }) => {
  const { user } = useUserStore();
  const src = getCoinImage(user?.rank?.currentRankCode);

  return (
    <img
      src={src}
      alt="coin"
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, ...style }}
    />
  );
};

export default CoinIcon;
