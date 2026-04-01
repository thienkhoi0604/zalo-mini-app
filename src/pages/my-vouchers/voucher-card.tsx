import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { UserReward } from '@/types/voucher';
import { formatDate } from '@/utils/date';
import { Gift, Clock, ChevronRight, MapPin } from 'lucide-react';

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
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        boxShadow: used
          ? '0 1px 4px rgba(0,0,0,0.06)'
          : '0 3px 14px rgba(40,143,78,0.13)',
        border: used ? '1px solid #F3F4F6' : '1px solid rgba(40,143,78,0.12)',
        cursor: onClick ? 'pointer' : 'default',
        opacity: used ? 0.85 : 1,
        position: 'relative',
      }}
      onClick={onClick}
    >
      {/* Left icon section */}
      <Box
        style={{
          width: 76,
          flexShrink: 0,
          background: used
            ? 'linear-gradient(145deg, #E5E7EB, #D1D5DB)'
            : 'linear-gradient(145deg, #2DA05A, #1e7a42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Gift size={30} color={used ? '#9CA3AF' : '#ffffff'} strokeWidth={1.8} />

        {/* Notch top */}
        <Box
          style={{
            position: 'absolute',
            right: -9,
            top: -9,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: used ? '#F9FAFB' : '#F3FBF6',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
          }}
        />
        {/* Notch bottom */}
        <Box
          style={{
            position: 'absolute',
            right: -9,
            bottom: -9,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: used ? '#F9FAFB' : '#F3FBF6',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
          }}
        />
      </Box>

      {/* Dashed separator */}
      <Box
        style={{
          width: 14,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            width: 0,
            height: '80%',
            borderLeft: `1.5px dashed ${used ? '#E5E7EB' : '#BBF7D0'}`,
          }}
        />
      </Box>

      {/* Content */}
      <Box
        style={{
          flex: 1,
          padding: '11px 8px 11px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          minWidth: 0,
        }}
      >
        {/* Status badge */}
        <Box style={{ display: 'inline-flex' }}>
          <span
            style={{
              background: used ? '#F3F4F6' : '#DCFCE7',
              color: used ? '#9CA3AF' : '#15803D',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 100,
              letterSpacing: 0.3,
            }}
          >
            {used ? 'Đã dùng' : 'Còn hiệu lực'}
          </span>
        </Box>

        {/* Reward name */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: used ? '#9CA3AF' : '#111827',
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
          <Box style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} color="#9CA3AF" />
            <p
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {userVoucher.storeName}
            </p>
          </Box>
        )}

        {/* Code + date row */}
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              background: used ? '#F3F4F6' : '#F0FDF4',
              color: used ? '#9CA3AF' : '#166534',
              padding: '2px 7px',
              borderRadius: 5,
            }}
          >
            {userVoucher.code}
          </span>

          {date && (
            <Box style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <Clock size={10} color={used ? '#D1D5DB' : '#6EE7B7'} />
              <span style={{ fontSize: 10, color: used ? '#D1D5DB' : '#6B7280' }}>
                {used ? date : `HSD: ${date}`}
              </span>
            </Box>
          )}
        </Box>
      </Box>

      {/* Chevron */}
      <Box style={{ display: 'flex', alignItems: 'center', paddingRight: 10, flexShrink: 0 }}>
        <ChevronRight size={15} color={used ? '#D1D5DB' : '#9CA3AF'} />
      </Box>

      {/* Used stamp overlay */}
      {used && (
        <Box
          style={{
            position: 'absolute',
            top: 10,
            right: 30,
            border: '1.5px solid #D1D5DB',
            borderRadius: 4,
            padding: '1px 5px',
            transform: 'rotate(-8deg)',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 900, color: '#6B7280', letterSpacing: 1 }}>
            ĐÃ DÙNG
          </span>
        </Box>
      )}
    </Box>
  );
};

export default VoucherCard;
