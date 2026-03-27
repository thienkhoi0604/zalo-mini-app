import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Reward } from '@/types/reward';

interface Props {
  card: Reward;
  onClick?: (card: Reward) => void;
}

const RewardItemCard: FC<Props> = ({ card, onClick }) => {
  const expired = card.status === 'expired';

  return (
    <Box
      onClick={() => onClick?.(card)}
      className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: 148,
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
        opacity: expired ? 0.72 : 1,
      }}
    >
      {/* Thumbnail */}
      <Box style={{ height: 96, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
          }}
        />

        {/* Expired overlay */}
        {expired && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.38)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box style={{ background: '#EF4444', borderRadius: 20, padding: '3px 10px' }}>
              <p style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>Hết hạn</p>
            </Box>
          </Box>
        )}

        {/* Points badge top-right */}
        {!expired && (
          <Box
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)',
              borderRadius: 100,
              padding: '2px 7px',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 10 }}>🪙</span>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Brand */}
        <Box flex className="items-center" style={{ gap: 5 }}>
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
              style={{ width: 8, height: 8, background: '#C49A6C' }}
            />
          )}
          <p
            className="truncate"
            style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}
          >
            {card.brandName || card.category}
          </p>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 12,
            color: '#111827',
            fontWeight: 700,
            lineHeight: '17px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 34,
          }}
        >
          {card.name}
        </p>
      </Box>
    </Box>
  );
};

export default RewardItemCard;
