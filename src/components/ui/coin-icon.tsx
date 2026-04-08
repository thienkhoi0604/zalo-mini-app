import React, { FC } from 'react';
import coinImg from '@/assets/images/coin.png';

interface CoinIconProps {
  size?: number;
  style?: React.CSSProperties;
}

const CoinIcon: FC<CoinIconProps> = ({ size = 16, style }) => (
  <img
    src={coinImg}
    alt="coin"
    style={{ width: size * 2, height: size * 1.5, objectFit: 'contain', flexShrink: 0, ...style }}
  />
);

export default CoinIcon;
