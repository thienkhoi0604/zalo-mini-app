import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Voucher } from '@/types/voucher';

interface Props {
  card: Voucher;
  onClick?: (card: Voucher) => void;
}

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

const VoucherItemCard: FC<Props> = ({ card, onClick }) => {
  const expired = card.status === 'expired';

  return (
    <Box
      onClick={() => onClick?.(card)}
      className="flex-shrink-0 cursor-pointer"
      style={{
        width: 160,
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: expired
          ? '0 1px 6px rgba(0,0,0,0.06)'
          : '0 6px 18px rgba(0,0,0,0.11)',
        opacity: expired ? 0.7 : 1,
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      {/* ── Image ── */}
      <Box style={{ height: 120, background: '#F0EBE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Expired overlay */}
        {expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.42)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box style={{ background: '#EF4444', borderRadius: 20, padding: '4px 13px', boxShadow: '0 2px 10px rgba(239,68,68,0.5)' }}>
              <p style={{ fontSize: 10, color: '#fff', fontWeight: 800, letterSpacing: 0.8 }}>HẾT HẠN</p>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Info ── */}
      <Box style={{ padding: '9px 10px 11px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Brand */}
        <p
          style={{
            fontSize: 9, color: '#A0AEC0', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.6,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}
        >
          {card.brandName ?? card.category}
        </p>

        {/* Name */}
        <p
          style={{
            fontSize: 12, fontWeight: 700, lineHeight: '17px',
            color: expired ? '#9CA3AF' : '#111827',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: 34,
          }}
        >
          {card.name}
        </p>

        {/* Cost strip */}
        {expired ? (
          <Box
            style={{
              marginTop: 1, borderRadius: 9, padding: '5px 9px',
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>Đã hết hạn</p>
          </Box>
        ) : (
          <Box
            style={{
              marginTop: 1, borderRadius: 9, padding: '5px 9px',
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1px solid #FDE68A',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <span style={{ fontSize: 13 }}>🪙</span>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#B45309' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
            {card.price != null && (
              <p style={{ fontSize: 9, color: '#D97706', marginLeft: 'auto', textDecoration: 'line-through', opacity: 0.7 }}>
                {card.price.toLocaleString('vi-VN')}đ
              </p>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VoucherItemCard;
