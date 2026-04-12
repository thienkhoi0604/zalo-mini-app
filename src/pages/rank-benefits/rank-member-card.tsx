import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useUserStore } from '@/store/user';
import logoImg from '@/assets/images/logo.png';

const RankMemberCard: FC = () => {
  const { user } = useUserStore();
  const rank = user?.rank;
  const rankName = rank?.currentRankName ?? 'Member';
  const rankIconUrl = rank?.currentRankIconUrl;

  return (
    <Box
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '3 / 4',
      }}
    >

      {/* ── Content ── */}
      <Box
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '32px 24px',
          gap: 24,
        }}
      >
        {/* Rank name */}
        <p
          style={{
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: 7,
            textTransform: 'uppercase',
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 2px 24px rgba(0,0,0,0.7)',
            lineHeight: 1.1,
          }}
        >
          {rankName}
        </p>

        {/* Rank icon — centered in remaining space */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <img
            src={rankIconUrl || logoImg}
            alt={rankName}
            style={{
              width: '65%',
              aspectRatio: '1 / 1',
              objectFit: 'contain',
            }}
            onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RankMemberCard;
