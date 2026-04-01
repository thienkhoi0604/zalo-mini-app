import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { QrCode, Bell } from 'lucide-react';
import { useUserStore } from '@/store/user';
import { useVouchersStore } from '@/store/vouchers';
import { ACTIVE_THEME } from '@/constants/theme';

// ─── Component ────────────────────────────────────────────────────────────────

export const HeroHeader: FC = () => {
  const navigate = useNavigate();
  const { user, pointWallet, isAuthenticated } = useUserStore();
  const { userVouchersUnusedCount } = useVouchersStore();

  const firstName = user?.fullName?.split(' ').pop() ?? 'bạn';
  const rankName = user?.rank?.currentRankName;
  const voucherCount = userVouchersUnusedCount ?? 0;

  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;
  const blobFaint = `rgba(255,255,255,${t.blobOpacity * 0.65})`;

  const iconBtn: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  };

  return (
    <Box>
      {/* Themed gradient header */}
      <Box style={{ background: gradient, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <Box style={{ position: 'absolute', top: -36, right: -28, width: 150, height: 150, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', top: 18, right: 90, width: 60, height: 60, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', bottom: 10, left: -18, width: 100, height: 100, borderRadius: '50%', background: blobFaint, pointerEvents: 'none' }} />

        {/* Optional texture */}
        {t.headerTexture && (
          <Box style={{ position: 'absolute', inset: 0, backgroundImage: `url(${t.headerTexture})`, backgroundSize: 'cover', opacity: t.headerTextureOpacity ?? 0.08, pointerEvents: 'none' }} />
        )}

        <Box style={{ position: 'relative', zIndex: 1, padding: '20px 16px 24px' }}>
          {isAuthenticated ? (
            <>
              {/* Top row: avatar + greeting left | QR + bell right */}
              <Box flex className="items-center justify-between" style={{ gap: 12 }}>
                {/* Left: avatar + greeting */}
                <Box flex className="items-center" style={{ gap: 10, minWidth: 0 }}>
                  {/* Avatar */}
                  <Box
                    style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.25)',
                      border: '2px solid rgba(255,255,255,0.5)',
                      overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                        {firstName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </Box>

                  {/* Name + rank */}
                  <Box style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                      Xin chào,
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: '22px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {firstName}
                    </p>
                    {rankName && (
                      <Box
                        style={{
                          marginTop: 4,
                          display: 'inline-flex', alignItems: 'center',
                          background: 'rgba(255,255,255,0.2)',
                          border: '1px solid rgba(255,255,255,0.35)',
                          borderRadius: 100,
                          padding: '2px 8px',
                        }}
                      >
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>⭐ {rankName}</p>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Right: QR + bell */}
                <Box flex className="items-center" style={{ gap: 8, flexShrink: 0 }}>
                  <div style={iconBtn} onClick={() => navigate('/qr-code')}>
                    <QrCode size={18} color="#fff" />
                  </div>
                  <div style={iconBtn}>
                    <Bell size={18} color="#fff" />
                  </div>
                </Box>
              </Box>

              {/* Bottom row: GreenCoin + Voucher stats */}
              <Box
                flex
                className="items-center"
                style={{
                  marginTop: 14,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  gap: 0,
                }}
              >
                {/* GreenCoin */}
                <Box flex className="items-center" style={{ gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 18 }}>🪙</span>
                  <Box>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                      {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>GreenCoin</p>
                  </Box>
                </Box>

                {/* Divider */}
                <Box style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.3)', margin: '0 12px' }} />

                {/* Voucher */}
                <Box flex className="items-center" style={{ gap: 6, flex: 1 }} onClick={() => navigate('/my-vouchers')}>
                  <span style={{ fontSize: 18 }}>🎫</span>
                  <Box>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                      {voucherCount}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>Voucher</p>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            /* Unauthenticated: greeting left + login button right */
            <Box flex className="items-start justify-between" style={{ gap: 12 }}>
              <Box>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                  Chào mừng đến với hệ sinh thái
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: '28px' }}>
                  EcoGreen 🌿
                </p>
              </Box>
              <button
                onClick={() => navigate('/register')}
                style={{
                  flexShrink: 0, marginTop: 4,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  borderRadius: 100, padding: '7px 18px',
                  cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              >
                Đăng nhập
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
