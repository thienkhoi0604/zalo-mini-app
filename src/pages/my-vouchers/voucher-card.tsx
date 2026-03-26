import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { UserReward } from '@/types/reward';
import { formatDate } from '@/utils/date';

interface Props {
  userVoucher: UserReward;
  used: boolean;
  onClick?: () => void;
}

const VoucherCard: FC<Props> = ({ userVoucher, used, onClick }) => {
  const date = used
    ? userVoucher.usedAt ? formatDate(userVoucher.usedAt) : null
    : formatDate(userVoucher.expiredAt);

  return (
    <Box
      className="bg-white rounded-2xl overflow-hidden flex"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Left: colored strip */}
      <Box
        style={{
          width: 8,
          flexShrink: 0,
          background: used ? '#D1D5DB' : '#288F4E',
        }}
      />

      {/* Dashed separator with ticket notch effect */}
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16, position: 'relative' }}>
        <Box style={{ width: 14, height: 14, borderRadius: '50%', background: '#EEF7F1', flexShrink: 0, marginTop: -7 }} />
        <Box style={{ flex: 1, borderLeft: '1.5px dashed #D1FAE5' }} />
        <Box style={{ width: 14, height: 14, borderRadius: '50%', background: '#EEF7F1', flexShrink: 0, marginBottom: -7 }} />
      </Box>

      {/* Right: Info */}
      <Box
        className="flex-1 py-3 pr-3 pl-1"
        style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
      >
        {/* Status pill */}
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
            {used ? 'Đã dùng' : 'Còn hiệu lực'}
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
          {userVoucher.rewardName}
        </p>

        {/* Store */}
        {userVoucher.storeName && (
          <p style={{ fontSize: 11, color: '#9CA3AF' }}>{userVoucher.storeName}</p>
        )}

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
            {userVoucher.code}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherCard;
