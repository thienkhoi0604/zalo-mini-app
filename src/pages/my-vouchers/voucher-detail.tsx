import React, { FC, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Box, useSnackbar } from 'zmp-ui';
import QRCode from 'react-qr-code';
import { openWebview } from 'zmp-sdk/apis';
import { Copy, CheckCircle, Clock, MapPin, Ticket, Store, Globe, Zap, Navigation } from 'lucide-react';
import { UserVoucher, UserVoucherItemType } from '@/types/voucher';
import { formatDate } from '@/utils/date';
import { fetchQRSession, QRSessionType } from '@/api/user';
import { COLORS } from '@/constants';

const QR_SESSION_TYPE: Record<UserVoucherItemType, QRSessionType> = {
  Reward: 'Voucher',
  Product: 'Product',
};

// ─── Detail row ────────────────────────────────────────────────────────────────

const DetailRow: FC<{
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  valueColor?: string;
}> = ({ icon, bg, label, value, valueColor = '#374151' }) => (
  <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Box
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, letterSpacing: 0.3, marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: valueColor, lineHeight: '18px' }}>
        {value}
      </p>
    </Box>
  </Box>
);

// ─── Not found ─────────────────────────────────────────────────────────────────

const NotFound: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 24px', gap: 16,
      }}
    >
      <Ticket size={48} color="#D1D5DB" strokeWidth={1.2} />
      <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>Không tìm thấy voucher</p>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>Vui lòng quay lại và thử lại</p>
      </Box>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 4, background: COLORS.primary, color: '#fff',
          border: 'none', borderRadius: 12, padding: '10px 24px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Quay lại
      </button>
    </Box>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const VoucherDetailPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const { state } = useLocation() as { state?: { userVoucher?: UserVoucher } };
  const userVoucher = state?.userVoucher ?? null;

  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isUsed = userVoucher?.usedAt != null;

  const fetchSession = (id: string, itemType: UserVoucherItemType) => {
    setQrLoading(true);
    setQrValue(null);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);

    fetchQRSession(id, QR_SESSION_TYPE[itemType])
      .then((session) => {
        setQrValue(session.token);
        setQrLoading(false);
        const seconds = session.expiresInSeconds ?? 270;
        setCountdown(seconds);

        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownRef.current!);
              countdownRef.current = null;
              fetchSession(id, itemType);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(() => { setQrLoading(false); });
  };

  useEffect(() => {
    if (!userVoucher || isUsed) return;
    fetchSession(userVoucher.id, userVoucher.itemType);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [userVoucher?.id, isUsed]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    if (!userVoucher?.code) return;
    navigator.clipboard
      .writeText(userVoucher.code)
      .then(() => openSnackbar({ text: 'Đã sao chép mã voucher!', type: 'success' }))
      .catch(() => openSnackbar({ text: 'Không thể sao chép', type: 'error' }));
  };

  if (!userVoucher) return <NotFound />;

  return (
    <Box
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#F8F9FA',
        paddingBottom: 'calc(24px + var(--zaui-safe-area-inset-bottom, 0px))',
      }}
    >

      {/* ── Status banner ── */}
      <Box
        style={{
          margin: '12px 16px 0',
          borderRadius: 16,
          padding: '14px 16px',
          background: isUsed
            ? 'linear-gradient(135deg, #F9FAFB, #F3F4F6)'
            : 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
          border: `1.5px solid ${isUsed ? '#E5E7EB' : '#BBF7D0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: isUsed ? '#9CA3AF' : '#111827',
            lineHeight: '21px',
            flex: 1,
          }}
        >
          {userVoucher.rewardName}
        </p>
        <span
          style={{
            background: isUsed ? '#E5E7EB' : COLORS.primary,
            color: isUsed ? '#6B7280' : '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 100,
            flexShrink: 0,
            letterSpacing: 0.3,
          }}
        >
          {isUsed ? 'Đã dùng' : 'Còn hiệu lực'}
        </span>
      </Box>

      {/* ── QR code (unused only) ── */}
      {!isUsed && (
        <Box style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12, fontWeight: 700, letterSpacing: 0.5 }}>
            MÃ QR
          </p>
          <Box
            style={{
              background: '#fff',
              borderRadius: 18,
              border: '1px solid #F0F1F3',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {qrLoading ? (
              <Box
                className="animate-pulse rounded-2xl"
                style={{ width: 200, height: 200, background: '#E9EBED' }}
              />
            ) : qrValue ? (
              <Box
                style={{
                  padding: 12,
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #F3F4F6',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
                }}
              >
                <QRCode
                  value={qrValue}
                  size={180}
                  fgColor="#1a1a1a"
                  bgColor="#ffffff"
                  style={{ display: 'block' }}
                />
              </Box>
            ) : null}
            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: '18px' }}>
              💡 Cho nhân viên quét mã này để sử dụng voucher
            </p>
            {countdown !== null && (
              <Box
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: countdown <= 30 ? '#FEF3C7' : '#F0FDF4',
                  border: `1px solid ${countdown <= 30 ? '#FDE68A' : '#BBF7D0'}`,
                  borderRadius: 10, padding: '6px 14px',
                }}
              >
                <Clock size={13} color={countdown <= 30 ? '#D97706' : COLORS.primary} />
                <p style={{ fontSize: 12, fontWeight: 700, color: countdown <= 30 ? '#D97706' : COLORS.primary }}>
                  Mã refresh sau {formatCountdown(countdown)}
                </p>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* ── Voucher code ── */}
      <Box style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10, fontWeight: 700, letterSpacing: 0.5 }}>
          MÃ VOUCHER
        </p>
        <Box
          style={{
            background: isUsed ? '#F9FAFB' : '#F0FDF4',
            border: `1.5px dashed ${isUsed ? '#E5E7EB' : '#86EFAC'}`,
            borderRadius: 16,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 22,
              fontWeight: 800,
              color: isUsed ? '#9CA3AF' : '#166534',
              letterSpacing: 3,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userVoucher.code}
          </p>
          {!isUsed ? (
            <button
              onClick={handleCopyCode}
              style={{
                background: COLORS.primary, color: '#fff', border: 'none',
                borderRadius: 10, padding: '8px 16px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              }}
            >
              <Copy size={13} />
              Sao chép
            </button>
          ) : (
            <CheckCircle size={24} color="#D1D5DB" />
          )}
        </Box>
      </Box>

      {/* ── Details card ── */}
      <Box
        style={{
          margin: '16px 16px 0',
          background: '#fff',
          borderRadius: 18,
          border: '1px solid #F0F1F3',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {!isUsed && (
          <DetailRow
            icon={<Clock size={16} color={COLORS.primary} />}
            bg={COLORS.primaryLight}
            label="HẠN SỬ DỤNG"
            value={formatDate(userVoucher.expiredAt)}
          />
        )}

        {isUsed && userVoucher.usedAt && (
          <DetailRow
            icon={<CheckCircle size={16} color="#9CA3AF" />}
            bg="#F3F4F6"
            label="ĐÃ SỬ DỤNG LÚC"
            value={formatDate(userVoucher.usedAt)}
            valueColor="#9CA3AF"
          />
        )}

      </Box>

      {/* ── Applicable stores ── */}
      {(userVoucher.appliesToAll || (userVoucher.appliedStores && userVoucher.appliedStores.length > 0)) && (
        <Box style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10, fontWeight: 700, letterSpacing: 0.5 }}>
            ĐỊA ĐIỂM ÁP DỤNG
          </p>

          {userVoucher.appliesToAll ? (
            <Box
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16,
              }}
            >
              <Box
                style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, #EEF7F1, #DCFCE7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Zap size={20} color={COLORS.primary} fill={COLORS.primary} strokeWidth={0} />
              </Box>
              <Box style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Tất cả trạm sạc EcoGreen</p>
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Áp dụng tại toàn bộ hệ thống</p>
              </Box>
              <Globe size={16} color={COLORS.primary} style={{ flexShrink: 0 }} />
            </Box>
          ) : (
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {userVoucher.appliedStores!.map((store) => (
                <Box
                  key={store.id}
                  onClick={() => store.googleMapsDirectionUrl && openWebview({ url: store.googleMapsDirectionUrl })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    background: '#fff',
                    border: '1px solid #F0F1F3',
                    borderRadius: 16,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    cursor: store.googleMapsDirectionUrl ? 'pointer' : 'default',
                  }}
                >
                  {(store.storeImageUrl ?? store.imageUrl) ? (
                    <img
                      src={store.storeImageUrl ?? store.imageUrl!}
                      alt={store.name}
                      style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <Box
                      style={{
                        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                        background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Store size={22} color="#7C3AED" />
                    </Box>
                  )}
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {store.name}
                    </p>
                    {store.address && (
                      <Box style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {store.address}
                        </p>
                      </Box>
                    )}
                  </Box>
                  {store.googleMapsDirectionUrl && (
                    <Navigation size={16} color="#7C3AED" style={{ flexShrink: 0 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

    </Box>
  );
};

export default VoucherDetailPage;
