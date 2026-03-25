import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { GiftCard, UserGiftCard } from '@/types/gift-card';

interface Props {
  giftCard: GiftCard;
  userVoucher: UserGiftCard;
  used: boolean;
  onClick: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const VoucherCard: FC<Props> = ({ giftCard, userVoucher, used, onClick }) => {
  const date = used
    ? userVoucher.redeemedAt
      ? formatDate(userVoucher.redeemedAt)
      : null
    : formatDate(giftCard.applicableTimeEnd);

  return (
    <Box
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden flex"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }}
    >
      {/* Left: Image */}
      <Box style={{ width: 90, flexShrink: 0, position: 'relative', minHeight: 100 }}>
        <img
          src={giftCard.thumbnailImageUrl}
          alt={giftCard.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
          }}
        />
        {used && (
          <Box
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.65)' }}
          >
            <Box
              className="rounded-full"
              style={{
                background: '#9CA3AF',
                padding: '3px 10px',
                transform: 'rotate(-20deg)',
              }}
            >
              <p style={{ fontSize: 10, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                Đã dùng
              </p>
            </Box>
          </Box>
        )}
      </Box>

      {/* Dashed separator with ticket notch effect */}
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16, position: 'relative' }}>
        <Box style={{ width: 14, height: 14, borderRadius: '50%', background: '#EEF7F1', flexShrink: 0, marginTop: -7 }} />
        <Box style={{ flex: 1, borderLeft: '1.5px dashed #D1FAE5' }} />
        <Box style={{ width: 14, height: 14, borderRadius: '50%', background: '#EEF7F1', flexShrink: 0, marginBottom: -7 }} />
      </Box>

      {/* Right: Info */}
      <Box
        className="flex-1 py-3 pr-3"
        style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
      >
        {/* Category pill */}
        <Box style={{ display: 'inline-flex' }}>
          <span
            style={{
              background: used ? '#F3F4F6' : '#EEF7F1',
              color: used ? '#9CA3AF' : '#288F4E',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 100,
            }}
          >
            {giftCard.category}
          </span>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: used ? '#9CA3AF' : '#1a1a1a',
            lineHeight: '18px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {giftCard.name}
        </p>

        {/* Date */}
        {date && (
          <p style={{ fontSize: 11, color: '#B0B0B0' }}>
            {used ? `Đã dùng: ${date}` : `HSD: ${date}`}
          </p>
        )}

        {/* Code */}
        <Box>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              background: used ? '#F9FAFB' : '#F0FDF4',
              padding: '3px 8px',
              borderRadius: 6,
              color: used ? '#9CA3AF' : '#288F4E',
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            {giftCard.code}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherCard;
