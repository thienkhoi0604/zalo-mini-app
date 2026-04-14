import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, useSnackbar } from 'zmp-ui';
import { QrCode, Bell } from 'lucide-react';
import { useUserStore } from '@/store/user';
import { useVouchersStore } from '@/store/vouchers';
import { ACTIVE_THEME } from '@/constants/theme';
import { getFirstName } from '@/utils/format';
import CoinIcon from '@/components/ui/coin-icon';
import UserAvatar from '@/components/ui/user-avatar';
import QRCodeSheet from '@/pages/profile/qr-code-sheet';
import { fetchQRSession } from '@/api/user';

// ─── Component ────────────────────────────────────────────────────────────────

export const HeroHeader: FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { user, pointWallet, isAuthenticated, authLoading } = useUserStore();
  const { userVouchersUnusedCount } = useVouchersStore();
  const [qrSheetVisible, setQrSheetVisible] = useState(false);

  const handleLogin = async () => {
    if (isAuthenticated) return;
    try {
      const result = await useUserStore.getState().loginWithZalo();
      if (result === 'permission_denied_info') {
        openSnackbar({ text: 'Bạn cần cấp quyền thông tin cá nhân để đăng nhập.', type: 'warning' });
        return;
      }
      if (result === 'permission_denied_location') {
        openSnackbar({ text: 'Bạn cần cấp quyền vị trí để đăng nhập.', type: 'warning' });
        return;
      }
      openSnackbar({ text: 'Đăng nhập thành công!', type: 'success' });
    } catch {
      openSnackbar({ text: 'Đăng nhập thất bại. Vui lòng thử lại.', type: 'error' });
    }
  };

  const firstName = getFirstName(user?.fullName);
  const rankName = user?.rank?.currentRankName;
  const voucherCount = userVouchersUnusedCount ?? 0;

  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;
  const blobFaint = `rgba(255,255,255,${t.blobOpacity * 0.65})`;

  const badgeH = 34;

  const iconBtn: React.CSSProperties = {
    width: badgeH,
    height: badgeH,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  };

  return (
    <Box>
      <QRCodeSheet
        visible={qrSheetVisible}
        onClose={() => setQrSheetVisible(false)}
        fetchData={() => fetchQRSession(null, 'Checkin').then((d) => d.token)}
        title="Mã QR của tôi"
        hint="💡 Cho nhân viên quét mã này để nhận điểm tại trạm sạc"
      />
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
              {/* Line 1: Xin chào, firstName */}
              <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: '22px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>Xin chào, </span>{firstName}
              </p>

              {/* Line 2: avatar + rank + QR + bell — all badges same height */}
              <Box flex className="items-center justify-between" style={{ gap: 8 }}>
                <Box flex className="items-center" style={{ gap: 8, minWidth: 0 }}>
                  {/* Avatar */}
                  <UserAvatar
                    avatarUrl={user?.avatarUrl}
                    fullName={user?.fullName}
                    bgOpacity={0.25}
                    borderOpacity={0.5}
                  />

                  {/* Rank badge — same height as icon buttons */}
                  {rankName && (
                    <Box
                      onClick={() => navigate('/rank-benefits')}
                      style={{
                        display: 'inline-flex', alignItems: 'center',
                        height: badgeH,
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.35)',
                        borderRadius: 100,
                        padding: '0 10px',
                        gap: 5,
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                    >
                      {user?.rank?.currentRankIconUrl && (
                        <img
                          src={user.rank.currentRankIconUrl}
                          alt={rankName}
                          style={{ width: 20, height: 20, objectFit: 'contain', display: 'block' }}
                        />
                      )}
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{rankName}</p>
                    </Box>
                  )}
                </Box>

                {/* QR + bell — same height as rank badge */}
                <Box flex className="items-center" style={{ gap: 8, flexShrink: 0 }}>
                  <div style={iconBtn} onClick={() => setQrSheetVisible(true)}>
                    <QrCode size={18} color="#fff" />
                  </div>
                  <div style={iconBtn}>
                    <Bell size={18} color="#fff" />
                  </div>
                </Box>
              </Box>

              {/* Bottom row: Lá + Voucher */}
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
                {/* Lá — balance */}
                <Box flex className="items-center" style={{ gap: 6, flex: 1, cursor: 'pointer' }} onClick={() => navigate('/checkin-history')}>
                  <CoinIcon size={20} />
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                  </p>
                </Box>

                {/* Divider */}
                <Box style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.3)', margin: '0 12px' }} />

                {/* Voucher */}
                <Box flex className="items-center" style={{ gap: 6, flex: 1 }} onClick={() => navigate('/my-vouchers')}>
                  <span style={{ fontSize: 20 }}>🎫</span>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {voucherCount}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>Voucher</p>
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
                onClick={handleLogin}
                disabled={authLoading}
                style={{
                  flexShrink: 0, marginTop: 4,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  borderRadius: 100, padding: '7px 18px',
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  opacity: authLoading ? 0.6 : 1,
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              >
                {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};