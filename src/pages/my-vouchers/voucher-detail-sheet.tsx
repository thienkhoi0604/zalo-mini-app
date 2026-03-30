import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, useSnackbar } from 'zmp-ui';
import QRCode from 'react-qr-code';
import { Sheet } from '@/components/ui/sheet';
import { UserReward } from '@/types/reward';
import { formatDate } from '@/utils/date';
import { Copy, CheckCircle, Clock, MapPin, Gift } from 'lucide-react';
import { fetchQRSession, QRSessionType } from '@/api/user';
import { UserRewardItemType } from '@/types/reward';

const QR_SESSION_TYPE: Record<UserRewardItemType, QRSessionType> = {
  Reward: 'Voucher',
  Product: 'Product',
};

interface Props {
  userVoucher: UserReward | null;
  onClose: () => void;
}

const VoucherDetailSheet: FC<Props> = ({ userVoucher, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const fetchedForIdRef = useRef<string | null>(null);

  const isUsed = userVoucher?.usedAt != null;

  useEffect(() => {
    if (!userVoucher || isUsed) return;
    if (fetchedForIdRef.current === userVoucher.id) return;
    fetchedForIdRef.current = userVoucher.id;

    setQrLoading(true);
    setQrValue(null);
    fetchQRSession(userVoucher.id, QR_SESSION_TYPE[userVoucher.itemType])
      .then((session) => {
        setQrValue(session.token);
        setQrLoading(false);
      })
      .catch(() => {
        setQrLoading(false);
      });
  }, [userVoucher?.id, isUsed]);

  const handleCopyCode = () => {
    if (!userVoucher?.code) return;
    navigator.clipboard
      .writeText(userVoucher.code)
      .then(() => openSnackbar({ text: 'Đã sao chép mã voucher!', type: 'success' }))
      .catch(() => openSnackbar({ text: 'Không thể sao chép', type: 'error' }));
  };

  return (
    <Sheet visible={!!userVoucher} onClose={onClose} height={90} swipeToClose unmountOnClose>
      {userVoucher && (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingBottom: 'calc(28px + var(--zaui-safe-area-inset-bottom, 0px))' }}>

          {/* Header banner */}
          <Box
            style={{
              background: isUsed
                ? 'linear-gradient(145deg, #E5E7EB, #D1D5DB)'
                : 'linear-gradient(145deg, #2DA05A, #1e7a42)',
              padding: '22px 20px 28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              position: 'relative',
            }}
          >
            <Box
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Gift size={28} color={isUsed ? '#9CA3AF' : '#fff'} strokeWidth={1.7} />
            </Box>

            <Box style={{ flex: 1, paddingTop: 2 }}>
              <span
                style={{
                  background: isUsed ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.25)',
                  color: isUsed ? '#6B7280' : '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 100,
                  display: 'inline-block',
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                {isUsed ? 'Đã dùng' : 'Còn hiệu lực'}
              </span>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isUsed ? '#6B7280' : '#fff',
                  lineHeight: '22px',
                }}
              >
                {userVoucher.rewardName}
              </p>
            </Box>
          </Box>

          {/* Ticket notch */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: -12,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <Box style={{ width: 24, height: 24, borderRadius: '50%', background: '#F5F5F5', flexShrink: 0 }} />
            <Box
              style={{
                flex: 1,
                borderTop: `2px dashed ${isUsed ? '#E5E7EB' : '#BBF7D0'}`,
                marginTop: 12,
              }}
            />
            <Box style={{ width: 24, height: 24, borderRadius: '50%', background: '#F5F5F5', flexShrink: 0 }} />
          </Box>

          {/* QR code – only for unused vouchers */}
          {!isUsed && (
            <Box style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12 }}>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10, fontWeight: 600, letterSpacing: 0.3 }}>
                MÃ QR
              </p>
              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {qrLoading ? (
                  <Box
                    className="animate-pulse rounded-2xl"
                    style={{ width: 196, height: 196, background: '#E9EBED' }}
                  />
                ) : qrValue ? (
                  <Box
                    className="bg-white rounded-2xl border border-gray-100"
                    style={{ padding: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                  >
                    <QRCode
                      value={qrValue}
                      size={172}
                      fgColor="#1a1a1a"
                      bgColor="#ffffff"
                      style={{ display: 'block' }}
                    />
                  </Box>
                ) : null}
                <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                  💡 Cho nhân viên quét mã này để sử dụng voucher
                </p>
              </Box>
            </Box>
          )}

          {/* Voucher code */}
          <Box style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 16 }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8, fontWeight: 600, letterSpacing: 0.3 }}>
              MÃ VOUCHER
            </p>
            <Box
              style={{
                background: isUsed ? '#F9FAFB' : '#F0FDF4',
                border: `1.5px dashed ${isUsed ? '#E5E7EB' : '#86EFAC'}`,
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 800,
                  color: isUsed ? '#9CA3AF' : '#166534',
                  letterSpacing: 3,
                }}
              >
                {userVoucher.code}
              </p>
              {!isUsed ? (
                <button
                  onClick={handleCopyCode}
                  style={{
                    background: '#288F4E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <Copy size={13} />
                  Sao chép
                </button>
              ) : (
                <CheckCircle size={22} color="#D1D5DB" />
              )}
            </Box>
          </Box>

          {/* Details */}
          <Box
            style={{
              margin: '16px 20px 0',
              background: '#F9FAFB',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {!isUsed && (
              <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box
                  style={{
                    width: 32, height: 32, borderRadius: 8, background: '#DCFCE7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <Clock size={15} color="#288F4E" />
                </Box>
                <Box>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 1 }}>HẠN SỬ DỤNG</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                    {formatDate(userVoucher.expiredAt)}
                  </p>
                </Box>
              </Box>
            )}

            {isUsed && userVoucher.usedAt && (
              <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box
                  style={{
                    width: 32, height: 32, borderRadius: 8, background: '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <CheckCircle size={15} color="#9CA3AF" />
                </Box>
                <Box>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 1 }}>ĐÃ SỬ DỤNG LÚC</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF' }}>
                    {formatDate(userVoucher.usedAt)}
                  </p>
                </Box>
              </Box>
            )}

            {userVoucher.storeName && (
              <>
                <Box style={{ height: 1, background: '#F3F4F6' }} />
                <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Box
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isUsed ? '#F3F4F6' : '#DCFCE7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <MapPin size={15} color={isUsed ? '#9CA3AF' : '#288F4E'} />
                  </Box>
                  <Box>
                    <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 1 }}>CỬA HÀNG ÁP DỤNG</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: isUsed ? '#9CA3AF' : '#374151' }}>
                      {userVoucher.storeName}
                    </p>
                  </Box>
                </Box>
              </>
            )}
          </Box>

        </Box>
      )}
    </Sheet>
  );
};

export default VoucherDetailSheet;
