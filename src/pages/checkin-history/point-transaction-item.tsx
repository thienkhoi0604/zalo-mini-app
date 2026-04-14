import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { TrendingDown, Zap } from 'lucide-react';
import { PointTransaction } from '@/types/point-transaction';
import { formatTime } from './utils';
import CoinIcon from '@/components/ui/coin-icon';

const PointTransactionItem: FC<{ item: PointTransaction; isLast: boolean }> = ({ item, isLast }) => {
  const isSpend = item.type === 'Spend';

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
      {/* Icon */}
      <Box
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          width: 44,
          height: 44,
          background: isSpend
            ? 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)'
            : 'linear-gradient(135deg, #EEF7F1 0%, #D1ECDB 100%)',
        }}
      >
        {isSpend
          ? <TrendingDown size={20} color="#EF4444" strokeWidth={2} />
          : <Zap size={20} color="#288F4E" fill="#288F4E" strokeWidth={0} />
        }
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
          {' · '}
          <span style={{ color: '#B0B7C0' }}>
            Số dư: {item.balanceAfter.toLocaleString('vi-VN')}
          </span>
        </p>
      </Box>

      {/* Points badge */}
      <Box
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          background: isSpend ? '#FEF2F2' : '#EEF7F1',
          padding: '4px 10px',
          minWidth: 60,
        }}
      >
        <Box flex className="items-center" style={{ gap: 3 }}>
          <CoinIcon size={13} />
          <p style={{ fontSize: 13, fontWeight: 700, color: isSpend ? '#EF4444' : '#288F4E' }}>
            {isSpend ? '-' : '+'}{item.points.toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default PointTransactionItem;
