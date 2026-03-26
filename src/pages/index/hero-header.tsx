import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Zap, Gift, Ticket, QrCode } from 'lucide-react';
import { useUserStore } from '@/stores/user';

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
    label: 'QR Code',
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

  return (
    <Box>
      {/* Green gradient top bar */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #2FA85F 0%, #1A6B38 100%)',
          padding: '20px 16px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: -20,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Greeting */}
        <Box style={{ position: 'relative' }}>
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
              alignSelf: 'flex-start',
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

      {/* Quick actions — overlapping card */}
      <Box
        className="bg-white rounded-2xl mx-4"
        style={{
          marginTop: -24,
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
