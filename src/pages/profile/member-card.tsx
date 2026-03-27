import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useUserStore } from '@/stores/user';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const MemberCard: FC = () => {
  const { user, pointWallet } = useUserStore();
  const initials = user?.fullName ? getInitials(user.fullName) : '';

  return (
    <Box
      className="mx-4 mt-4 rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #D8B07A 0%, #C49A6C 25%, #B4884F 50%, #A0784A 75%, #8C6538 100%)',
        boxShadow: '0 10px 25px rgba(160,120,74,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Shimmer overlay */}
      <Box
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 60%)',
        }}
      />

      {/* Content */}
      <Box className="relative px-4 pt-5 pb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        {/* Avatar */}
        <Box
          className="flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #E8CFA0 0%, #C49A6C 100%)',
            border: '3px solid rgba(255,255,255,0.6)',
            flexShrink: 0,
          }}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName ?? ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700, color: '#7A5230' }}>{initials}</span>
          )}
        </Box>

        {/* Name */}
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: '24px', textAlign: 'center' }}>
          {user?.fullName || 'Tên thành viên'}
        </p>

        {/* Rank | Points */}
        <Box
          flex
          className="w-full rounded-xl py-3 px-4"
          style={{ background: 'rgba(255,255,255,0.15)', gap: 0 }}
        >
          <Box className="flex-1 text-center">
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
              {user?.rank?.currentRankName || 'Member'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 3 }}>
              Hạng thành viên
            </p>
          </Box>

          <Box style={{ width: 1, background: 'rgba(255,255,255,0.35)', margin: '0 8px' }} />

          <Box className="flex-1 text-center">
            <Box flex className="justify-center items-center" style={{ gap: 4 }}>
              <span style={{ fontSize: 15 }}>🪙</span>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
              </p>
            </Box>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 3 }}>
              Xu khả dụng
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MemberCard;
