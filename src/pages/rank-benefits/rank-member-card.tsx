import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useUserStore } from '@/store/user';
import bgVertical from '@/assets/images/background-profile-vertical.png';
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
        borderRadius: 28,
        overflow: 'hidden',
        aspectRatio: '9 / 14',
        width: '100%',
      }}
    >
      {/* ── Background image ── */}
      <img
        src={bgVertical}
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          pointerEvents: 'none',
        }}
      />

      {/* ── Base dark overlay ── */}
      <Box
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(2, 6, 20, 0.62)' }}
      />

      {/* ── Center vignette — darkens the card focus zone ── */}
      <Box
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 52%, rgba(0,0,0,0.45) 0%, transparent 100%)',
        }}
      />

      {/* ── Edge glow — brightens outer rim for depth ── */}
      <Box
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 55%, rgba(80,120,255,0.10) 100%)',
        }}
      />

      {/* ── Subtle top light leak ── */}
      <Box
        className="absolute pointer-events-none"
        style={{
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: 220,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(120,160,255,0.18) 0%, transparent 70%)',
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
          padding: '32px 24px 40px',
          gap: 0,
        }}
      >
        {/* ── Rank name ── */}
        <p
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(120,160,255,0.6), 0 2px 16px rgba(0,0,0,0.8)',
            lineHeight: 1.1,
            marginBottom: 36,
          }}
        >
          {rankName}
        </p>

        {/* ── Main rank card ── */}
        <Box
          style={{
            position: 'relative',
            width: '78%',
            aspectRatio: '1 / 1',
            borderRadius: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 80px rgba(80,120,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Inner glow behind icon */}
          <Box
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              borderRadius: 32,
              background: 'radial-gradient(ellipse 70% 70% at 50% 40%, rgba(100,140,255,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Rank icon */}
          <img
            src={rankIconUrl || logoImg}
            alt={rankName}
            style={{
              width: '62%',
              height: '62%',
              objectFit: 'contain',
              position: 'relative',
              filter: 'drop-shadow(0 0 24px rgba(180,210,255,0.5)) drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
          />
        </Box>

      </Box>
    </Box>
  );
};

export default RankMemberCard;
