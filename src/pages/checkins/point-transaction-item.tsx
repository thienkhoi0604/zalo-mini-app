import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { PointTransaction } from '@/types/point-transaction';
import { useUserStore } from '@/store/user';
import { formatTime } from './utils';
import CoinIcon from '@/components/ui/coin-icon';

const PointTransactionItem: FC<{ item: PointTransaction; isLast: boolean }> = ({ item, isLast }) => {
  const isSpend = item.type === 'Spend';
  const isGreenCoin = item.type === 'GreenCoin';
  const { user } = useUserStore();
  const rankIconUrl = user?.rank?.currentRankIconUrl;

  const badgeBg = isSpend ? '#FEF2F2' : isGreenCoin ? '#FFFBEB' : '#EEF7F1';
  const amountColor = isSpend ? '#EF4444' : isGreenCoin ? '#D97706' : '#288F4E';
  const prefix = isSpend ? '-' : '+';

  return (
    <Box
      flex
      className="items-center"
      style={{
        padding: '12px 16px',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
        gap: 12,
      }}
    >
      {/* Left icon — no background */}
      <Box
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 44, height: 44 }}
      >
        {isGreenCoin && rankIconUrl ? (
          <img
            src={rankIconUrl}
            alt="rank"
            style={{ width: 44, height: 44, objectFit: 'contain' }}
          />
        ) : (
          <CoinIcon size={26} />
        )}
      </Box>

      {/* Text */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1a1a1a',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '18px',
          }}
        >
          {item.description}
        </p>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>
          {formatTime(item.createdAt)}
          {!isGreenCoin && (
            <>
              {' · '}
              <span style={{ color: '#B0B7C0' }}>
                Số dư: {item.balanceAfter.toLocaleString('vi-VN')}
              </span>
            </>
          )}
        </p>
      </Box>

      {/* Points badge */}
      <Box
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ background: badgeBg, padding: '4px 10px', minWidth: 60 }}
      >
        <Box flex className="items-center" style={{ gap: 3 }}>
          {isGreenCoin && rankIconUrl ? (
            <img src={rankIconUrl} alt="rank" style={{ width: 14, height: 14, objectFit: 'contain' }} />
          ) : (
            <CoinIcon size={13} />
          )}
          <p style={{ fontSize: 13, fontWeight: 700, color: amountColor }}>
            {prefix}{item.points.toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default PointTransactionItem;
