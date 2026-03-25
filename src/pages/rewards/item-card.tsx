import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Reward } from '@/types/reward';

interface Props {
  card: Reward;
  onClick?: (card: Reward) => void;
}

const RewardItemCard: FC<Props> = ({ card, onClick }) => {
  return (
    <Box
      onClick={() => onClick?.(card)}
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: 140,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Thumbnail */}
      <Box
        className="w-full overflow-hidden relative"
        style={{ height: 90, background: '#F3EDE3' }}
      >
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
          }}
        />
        {card.status === 'expired' && (
          <Box
            className="absolute top-2 right-2 rounded-full"
            style={{ background: '#EF4444', padding: '2px 7px' }}
          >
            <p style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>
              Hết hạn
            </p>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box className="px-2 py-2 flex flex-col" style={{ gap: 3 }}>
        {/* Brand */}
        <Box flex className="items-center" style={{ gap: 4 }}>
          {card.brandLogoUrl ? (
            <img
              src={card.brandLogoUrl}
              alt={card.brandName}
              className="rounded-full object-cover flex-shrink-0"
              style={{ width: 14, height: 14 }}
            />
          ) : (
            <Box
              className="rounded-full flex-shrink-0"
              style={{ width: 14, height: 14, background: '#C49A6C' }}
            />
          )}
          <p
            className="truncate"
            style={{ fontSize: 10, color: '#999', fontWeight: 600 }}
          >
            {card.brandName || card.category}
          </p>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 12,
            color: '#1a1a1a',
            fontWeight: 600,
            lineHeight: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 32,
          }}
        >
          {card.name}
        </p>

        {/* Points */}
        <Box flex className="items-center" style={{ gap: 3 }}>
          <span style={{ fontSize: 13 }}>🪙</span>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#C49A6C' }}>
            {card.pointsRequired}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default RewardItemCard;
