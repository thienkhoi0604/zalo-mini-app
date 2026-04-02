import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { ShieldCheck } from 'lucide-react';
import { useUserStore } from '@/store/user';
import bgProfile from '@/assets/images/background-profile.png';
import logoImg from '@/assets/images/logo.png';
import CoinIcon from '@/components/ui/coin-icon';

const MemberCard: FC = () => {
  const { user, pointWallet } = useUserStore();
  const isVerified = pointWallet?.vehicleStatus?.toLowerCase() === 'approved';

  return (
    /* Outer wrapper — extra paddingTop so the logo can overflow the card top */
    <Box className="mx-4 mt-2" style={{ position: 'relative', paddingTop: 36 }}>

      {/* ── Floating avatar ── */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: 68,
          height: 68,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid rgba(100,160,255,0.4)',
          boxShadow: '0 0 0 4px rgba(80,130,255,0.12), 0 6px 20px rgba(0,0,0,0.5)',
          background: '#0a1428',
        }}
      >
        <img
          src={user?.avatarUrl || logoImg}
          alt={user?.fullName || 'EcoGreen'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
        />
      </Box>

      {/* ── Card ── */}
      <Box
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Background image */}
        <img
          src={bgProfile}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            pointerEvents: 'none',
          }}
        />

        {/* Dark overlay */}
        <Box
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(170deg, rgba(0,4,22,0.55) 0%, rgba(0,10,35,0.72) 100%)' }}
        />

        {/* Blue glow at top-center (behind logo) */}
        <Box
          className="absolute pointer-events-none"
          style={{
            top: -20, left: '50%', transform: 'translateX(-50%)',
            width: 180, height: 100,
            background: 'radial-gradient(ellipse, rgba(80,140,255,0.2) 0%, transparent 70%)',
          }}
        />

        {/* ── Content ── */}
        <Box
          style={{
            position: 'relative',
            paddingTop: 46,   /* space below the overlapping logo */
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Name */}
          <p
            style={{
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              lineHeight: '24px',
              letterSpacing: -0.3,
              textAlign: 'center',
              textShadow: '0 1px 10px rgba(0,0,0,0.7)',
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {user?.fullName || 'Tên thành viên'}
          </p>

          {/* Phone */}
          {/* {user?.phone && (
            <p
              style={{
                color: 'rgba(160,200,255,0.7)',
                fontSize: 12,
                fontWeight: 500,
                marginTop: 4,
                letterSpacing: 0.5,
              }}
            >
              {user.phone}
            </p>
          )} */}

          {/* Divider */}
          <Box
            style={{
              width: '80%',
              height: 1,
              margin: '14px 0 0',
              background: 'linear-gradient(90deg, transparent, rgba(100,160,255,0.35), transparent)',
            }}
          />

          {/* Rank | Points row */}
          <Box
            flex
            className="w-full items-center"
            style={{ padding: '12px 20px 14px' }}
          >
            {/* Rank */}
            <Box className="flex-1 text-center">
              <p
                style={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {user?.rank?.currentRankName || 'Member'}
              </p>
              <p style={{ color: 'rgba(160,200,255,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Hạng thành viên
              </p>
            </Box>

            {/* Vertical divider */}
            <Box style={{ width: 1, height: 36, background: 'rgba(100,160,255,0.25)', flexShrink: 0 }} />

            {/* Points */}
            <Box className="flex-1 text-center">
              <Box flex className="justify-center items-center" style={{ gap: 4, marginBottom: 4 }}>
                <CoinIcon size={20} />
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: -0.4, lineHeight: 1 }}>
                  {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                </p>
              </Box>
              <p style={{ color: 'rgba(160,200,255,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                GreenCoin
              </p>
            </Box>
          </Box>

          {/* ── Verified badge ── */}
          {isVerified && (
            <Box
              flex
              className="items-center justify-center w-full"
              style={{
                gap: 7,
                padding: '10px 20px',
                borderTop: '1px solid rgba(100,160,255,0.15)',
                background: 'rgba(30,80,200,0.18)',
              }}
            >
              <ShieldCheck size={14} color="#60A5FA" strokeWidth={2.5} />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#93C5FD', letterSpacing: 0.3 }}>
                Tài khoản đã xác thực
              </p>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MemberCard;
