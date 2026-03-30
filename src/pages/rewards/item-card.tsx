import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Reward, getRewardTypeLabel } from '@/types/reward';

interface Props {
  card: Reward;
  onClick?: (card: Reward) => void;
}

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

const RewardItemCard: FC<Props> = ({ card, onClick }) => {
  const expired = card.status === 'expired';

  return (
    <Box
      onClick={() => onClick?.(card)}
      className="flex-shrink-0 cursor-pointer"
      style={{
        width: 156,
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: expired
          ? '0 1px 6px rgba(0,0,0,0.06)'
          : '0 4px 14px rgba(0,0,0,0.1)',
        opacity: expired ? 0.72 : 1,
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Thumbnail */}
      <Box style={{ height: 108, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Bottom scrim */}
        {!expired && (
          <Box
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 44,
              background: 'linear-gradient(to top, rgba(0,0,0,0.32), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Expired overlay */}
        {expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box style={{ background: '#EF4444', borderRadius: 20, padding: '3px 12px', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
              <p style={{ fontSize: 10, color: '#fff', fontWeight: 800, letterSpacing: 0.5 }}>HẾT HẠN</p>
            </Box>
          </Box>
        )}

        {/* Points badge */}
        {!expired && (
          <Box
            style={{
              position: 'absolute', top: 7, right: 7,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 100,
              padding: '3px 7px',
              display: 'flex', alignItems: 'center', gap: 3,
              boxShadow: '0 2px 6px rgba(217,119,6,0.45)',
            }}
          >
            <span style={{ fontSize: 9 }}>🪙</span>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box style={{ padding: '9px 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Brand */}
        <Box flex className="items-center" style={{ gap: 5 }}>
          {card.brandLogoUrl ? (
            <img
              src={card.brandLogoUrl}
              alt={card.brandName}
              style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <Box
              style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)',
                flexShrink: 0,
              }}
            />
          )}
          <p
            style={{
              fontSize: 9, color: '#B0B7C3', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            {card.brandName || getRewardTypeLabel(card.type)}
          </p>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 12, color: expired ? '#9CA3AF' : '#111827', fontWeight: 700,
            lineHeight: '17px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: 34,
          }}
        >
          {card.name}
        </p>

        {/* Points strip */}
        {!expired && (
          <Box
            style={{
              marginTop: 1,
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '5px 8px',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ fontSize: 12 }}>🪙</span>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#B45309' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
            <p style={{ fontSize: 10, color: '#D97706', fontWeight: 500 }}>xu</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RewardItemCard;
