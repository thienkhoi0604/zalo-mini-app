import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Voucher, getVoucherTypeLabel } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';

interface Props {
  card: Voucher;
  onClick: (card: Voucher) => void;
}

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

function getTypeChipStyle(type: string) {
  switch (type) {
    case 'Voucher':      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    case 'PhysicalItem': return { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' };
    case 'FnbProduct':   return { bg: '#CFFAFE', text: '#0E7490', border: '#A5F3FC' };
    default:             return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
}

const VoucherCard: FC<Props> = ({ card, onClick }) => {
  const chip = getTypeChipStyle(card.type);

  return (
    <Box
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Image */}
      <Box style={{ height: 144, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        <Box
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Info */}
      <Box style={{ padding: '10px 11px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Type chip */}
        <Box
          style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: chip.bg, border: `1px solid ${chip.border}`,
            borderRadius: 6, padding: '2px 7px',
          }}
        >
          <p style={{ fontSize: 9, color: chip.text, fontWeight: 700, letterSpacing: 0.3 }}>
            {getVoucherTypeLabel(card.type)}
          </p>
        </Box>

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
            borderRadius: 9, padding: '6px 9px',
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '1px solid #FDE68A',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <CoinIcon size={16} />
          <p style={{ fontSize: 13, fontWeight: 800, color: '#B45309' }}>
            {card.pointsRequired.toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherCard;
