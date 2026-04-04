import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, Zap, QrCode, Gift, User } from 'lucide-react';
import { useVirtualKeyboardVisible } from '@/hooks/use-virtual-keyboard-visible';

// ─── Tab config ───────────────────────────────────────────────────────────────

interface Tab {
  path: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  qr?: boolean;
}

const TABS: Tab[] = [
  {
    path: '/',
    label: 'Trang chủ',
    icon: (active) => <Home size={22} strokeWidth={active ? 2.2 : 1.8} />,
  },
  {
    path: '/stations',
    label: 'Trạm sạc',
    icon: (active) => <Zap size={22} strokeWidth={active ? 2.2 : 1.8} fill={active ? 'currentColor' : 'none'} />,
  },
  {
    path: '/qr-code',
    label: 'QR',
    icon: () => <QrCode size={24} color="#fff" strokeWidth={2} />,
    qr: true,
  },
  {
    path: '/rewards',
    label: 'Voucher',
    icon: (active) => <Gift size={22} strokeWidth={active ? 2.2 : 1.8} fill={active ? 'currentColor' : 'none'} />,
  },
  {
    path: '/profile',
    label: 'Tài khoản',
    icon: (active) => <User size={22} strokeWidth={active ? 2.2 : 1.8} />,
  },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const Navigation: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (keyboardVisible) return null;

  return (
    <div
      style={{
        flexShrink: 0,
        position: 'relative',
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        paddingBottom: 'calc(var(--zaui-safe-area-inset-bottom, 0px))',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: 60,
        }}
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;

          // ── Center QR FAB ──
          if (tab.qr) {
            return (
              <button
                key={tab.path}
                onClick={() => {
                  if (pathname === '/qr-code') {
                    navigate('/qr-code', { replace: true, state: { rescan: Date.now() } });
                  } else {
                    navigate(tab.path);
                  }
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Elevated circle */}
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(145deg, #34D268, #1A6B38)'
                      : 'linear-gradient(145deg, #2FA85F, #1e7a42)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive
                      ? '0 6px 20px rgba(40,143,78,0.55), 0 0 0 4px rgba(40,143,78,0.12)'
                      : '0 4px 16px rgba(40,143,78,0.4)',
                    transition: 'box-shadow 0.2s, background 0.2s',
                  }}
                >
                  {tab.icon(isActive)}
                </div>
                {/* Label below the circle position */}
                <span
                  style={{
                    marginTop: 38,
                    fontSize: 10,
                    fontWeight: 700,
                    color: isActive ? '#288F4E' : '#9CA3AF',
                    letterSpacing: 0.2,
                    transition: 'color 0.2s',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          // ── Regular tab ──
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                paddingTop: 2,
              }}
            >
              {/* Active pill background */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    width: 44,
                    height: 30,
                    borderRadius: 10,
                    background: '#EEF7F1',
                  }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  position: 'relative',
                  color: isActive ? '#288F4E' : '#B0B7C3',
                  transition: 'color 0.2s, transform 0.2s',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 26,
                }}
              >
                {tab.icon(isActive)}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#288F4E' : '#B0B7C3',
                  letterSpacing: 0.2,
                  transition: 'color 0.2s, font-weight 0.2s',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#288F4E',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type TabKeys = (typeof TABS)[number]['path'];
