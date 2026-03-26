import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useUserStore } from '@/stores/user';


const MemberCard: FC = () => {
  const { user, pointWallet } = useUserStore();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .slice(-2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <Box
      className="mx-4 mt-4 pb-2 rounded-2xl overflow-visible relative"
      style={{
        background: 'linear-gradient(135deg, #C49A6C 0%, #A0784A 100%)',
      }}
    >
      {/* Avatar */}
      <Box className="flex justify-center" style={{ marginTop: -1 }}>
        <Box
          className="relative flex items-center justify-center rounded-full border-4 border-white"
          style={{
            width: 72,
            height: 72,
            background: 'linear-gradient(135deg, #E8CFA0 0%, #C49A6C 100%)',
            marginTop: -36,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#7A5230' }}>
            {initials}
          </span>
        </Box>
      </Box>

      {/* Name & phone */}
      <Box className="text-center px-4 pt-2 pb-1">
        <p
          style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: '26px',
          }}
        >
          {user?.fullName || 'Tên thành viên'}
        </p>
      </Box>

      {/* Rank | Xu row */}
      <Box
        flex
        className="mx-4 mb-4 mt-2 py-3 px-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.15)', gap: 0 }}
      >
        <Box className="flex-1 text-center">
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {user?.rank?.currentRankName || 'Member'}
          </p>
          <p style={{ color: 'rgba(255,255,255)', fontSize: 12, marginTop: 2 }}>
            Hạng thành viên
          </p>
        </Box>
        <Box
          style={{
            width: 1,
            background: 'rgba(255,255,255,0.35)',
            margin: '0 8px',
          }}
        />
        <Box className="flex-1 text-center">
          <Box flex className="justify-center items-center" style={{ gap: 4 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
              {pointWallet?.currentBalance ?? 0}
            </p>
            <span style={{ fontSize: 16 }}>🪙</span>
          </Box>
          <p style={{ color: 'rgba(255,255,255)', fontSize: 12, marginTop: 2 }}>
            Xu khả dụng
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default MemberCard;
