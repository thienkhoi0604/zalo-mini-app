import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Zap, Gift, Ticket, QrCode } from 'lucide-react';
import { useUserStore } from '@/store/user';
import { ACTIVE_THEME } from '@/constants/theme';

// ─── Quick action ──────────────────────────────────────────────────────────────

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  route: string;
  bg: string;
  iconBg: string;
}

const ACTIONS: QuickAction[] = [
  {
    icon: <Zap size={20} color="#fff" fill="#fff" strokeWidth={0} />,
    label: 'Trạm sạc',
    route: '/stations',
    bg: '#EEF7F1',
    iconBg: 'linear-gradient(135deg, #43B96B, #288F4E)',
  },
  {
    icon: <Gift size={20} color="#fff" />,
    label: 'Phần thưởng',
    route: '/rewards',
    bg: '#FEF9EF',
    iconBg: 'linear-gradient(135deg, #E8CFA0, #C49A6C)',
  },
  {
    icon: <Ticket size={20} color="#fff" />,
    label: 'Voucher',
    route: '/my-vouchers',
    bg: '#EFF6FF',
    iconBg: 'linear-gradient(135deg, #60A5FA, #2563EB)',
  },
  {
    icon: <QrCode size={20} color="#fff" />,
    label: 'Mã QR',
    route: '/qr-code',
    bg: '#F5F3FF',
    iconBg: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const HeroHeader: FC = () => {
  const navigate = useNavigate();
  const { user, pointWallet, isAuthenticated } = useUserStore();

  const firstName = user?.fullName?.split(' ').pop() ?? 'bạn';

  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;
  const blobFaint = `rgba(255,255,255,${t.blobOpacity * 0.65})`;

  return (
    <Box>
      {/* Themed gradient header */}
      <Box
        style={{
          background: gradient,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box style={{ position: 'absolute', top: -36, right: -28, width: 150, height: 150, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', top: 18, right: 90, width: 60, height: 60, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', bottom: 10, left: -18, width: 100, height: 100, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />

        {/* Optional texture */}
        {t.headerTexture && (
          <Box style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.headerTexture})`, backgroundSize: 'cover', opacity: t.headerTextureOpacity ?? 0.08, pointerEvents: 'none' }} />
        )}

        {/* Content — sits above the wave */}
        <Box style={{ position: 'relative', zIndex: 1, padding: '20px 16px 56px' }}>
          {/* Greeting */}
          <Box>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
              {isAuthenticated ? `Xin chào, ${firstName} 👋` : 'Chào mừng đến với'}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: '28px' }}>
              EcoGreen 🌿
            </p>
          </Box>

          {/* Points pill */}
          {isAuthenticated && (
            <Box
              flex
              className="items-center"
              style={{
                marginTop: 14,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 100,
                padding: '7px 14px',
                gap: 6,
                display: 'inline-flex',
                width: 'fit-content',
              }}
            >
              <span style={{ fontSize: 16 }}>🪙</span>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>xu</p>
            </Box>
          )}
        </Box>

        {/* Wave divider — blends into page background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0, pointerEvents: 'none' }}>
          <svg viewBox="0 0 390 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40 }}>
            <path d={t.wavePath} fill={t.pageBg} />
          </svg>
        </div>
      </Box>

      {/* Quick actions — overlapping card, sits over the wave */}
      <Box
        className="bg-white rounded-2xl mx-4"
        style={{
          marginTop: -48,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '16px 8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {ACTIONS.map((action) => (
          <Box
            key={action.route}
            className="flex flex-col items-center cursor-pointer"
            style={{ gap: 8 }}
            onClick={() => navigate(action.route)}
          >
            <Box
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 48, height: 48, background: action.iconBg }}
            >
              {action.icon}
            </Box>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', textAlign: 'center' }}>
              {action.label}
            </p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
