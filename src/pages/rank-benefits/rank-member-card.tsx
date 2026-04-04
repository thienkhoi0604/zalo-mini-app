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
      {/* ── Rank icon as full-bleed background ── */}
      <img
        src={rankIconUrl || logoImg}
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'scale(1.1)',
          filter: 'blur(28px) saturate(1.6) brightness(0.7)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Dark vignette overlay ── */}
      <Box
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(4,8,24,0.35) 0%, rgba(4,8,24,0.55) 60%, rgba(4,8,24,0.80) 100%)',
        }}
      />

      {/* ── Sheen at top ── */}
      <Box
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />

      {/* ── Content ── */}
      <Box
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          gap: 24,
        }}
      >
        {/* Rank icon — sharp focal image */}
        <img
          src={rankIconUrl || logoImg}
          alt={rankName}
          style={{
            width: '55%',
            aspectRatio: '1 / 1',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.25)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
          }}
          onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
        />

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
      </Box>
    </Box>
  );
};

export default RankMemberCard;
