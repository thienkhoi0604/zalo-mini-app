import React, { FC } from 'react';
import { useUserStore } from '@/store/user';

interface CoinIconProps {
  size?: number;
  style?: React.CSSProperties;
}

const CoinIcon: FC<CoinIconProps> = ({ size = 16, style }) => {
  const { user } = useUserStore();
  const src = user?.rank?.currentRankIconUrl;

  if (!src) return null;

  return (
    <img
      src={src}
      alt="coin"
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, ...style }}
    />
  );
};

export default CoinIcon;
