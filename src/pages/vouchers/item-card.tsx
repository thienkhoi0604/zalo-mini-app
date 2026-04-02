import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';

interface Props {
  card: Voucher;
  onClick?: (card: Voucher) => void;
}

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

const VoucherItemCard: FC<Props> = ({ card, onClick }) => (
  <Box
    onClick={() => onClick?.(card)}
    className="flex-shrink-0 cursor-pointer"
    style={{
      width: 160,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 6px 18px rgba(0,0,0,0.11)',
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
          color: '#111827',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 34,
        }}
      >
        {card.name}
      </p>

      {/* Cost strip */}
      <Box
        style={{
          marginTop: 1, borderRadius: 9, padding: '5px 9px',
          background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
          border: '1px solid #FDE68A',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <CoinIcon size={16} />
        <p style={{ fontSize: 13, fontWeight: 800, color: '#B45309' }}>
          {card.pointsRequired.toLocaleString('vi-VN')}
        </p>
        {card.price != null && (
          <p style={{ fontSize: 9, color: '#D97706', marginLeft: 'auto', textDecoration: 'line-through', opacity: 0.7 }}>
            {card.price.toLocaleString('vi-VN')}đ
          </p>
        )}
      </Box>
    </Box>
  </Box>
);

export default VoucherItemCard;
