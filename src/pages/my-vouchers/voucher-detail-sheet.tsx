import React, { FC } from 'react';
import { Box, useSnackbar } from 'zmp-ui';
import { Sheet } from '@/components/fullscreen-sheet';
import { UserReward } from '@/types/reward';
import { formatDate } from '@/utils/date';

interface Props {
  userVoucher: UserReward | null;
  onClose: () => void;
}

const VoucherDetailSheet: FC<Props> = ({ userVoucher, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const isUsed = userVoucher?.usedAt != null;

  const handleCopyCode = () => {
    if (!userVoucher?.code) return;
    navigator.clipboard
      .writeText(userVoucher.code)
      .then(() => openSnackbar({ text: 'Đã sao chép mã voucher!', type: 'success' }))
      .catch(() => openSnackbar({ text: 'Không thể sao chép', type: 'error' }));
  };

  return (
    <Sheet
      visible={!!userVoucher}
      onClose={onClose}
      autoHeight
      swipeToClose
      unmountOnClose
    >
      {userVoucher && (
        <Box className="flex flex-col pb-6">
          {/* Info */}
          <Box className="px-4 pt-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status + Name */}
            <Box>
              <span
                style={{
                  background: isUsed ? '#F3F4F6' : '#EEF7F1',
                  color: isUsed ? '#9CA3AF' : '#288F4E',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 100,
                }}
              >
                {isUsed ? 'Đã dùng' : 'Còn hiệu lực'}
              </span>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isUsed ? '#9CA3AF' : '#1a1a1a',
                  marginTop: 6,
                  lineHeight: '22px',
                }}
              >
                {userVoucher.rewardName}
              </p>
            </Box>

            {/* Voucher code */}
            <Box
              className="flex items-center justify-between"
              style={{
                background: isUsed ? '#F9FAFB' : '#F0FDF4',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <Box>
                <p style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>Mã voucher</p>
                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 18,
                    fontWeight: 700,
                    color: isUsed ? '#9CA3AF' : '#288F4E',
                    letterSpacing: 2,
                  }}
                >
                  {userVoucher.code}
                </p>
              </Box>
              {!isUsed && (
                <button
                  onClick={handleCopyCode}
                  style={{
                    background: '#288F4E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Sao chép
                </button>
              )}
            </Box>

            {/* Dates */}
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {!isUsed && (
                <p style={{ fontSize: 12, color: '#6B7280' }}>
                  <span style={{ fontWeight: 600 }}>Hạn sử dụng: </span>
                  {formatDate(userVoucher.expiredAt)}
                </p>
              )}
              {isUsed && userVoucher.usedAt && (
                <p style={{ fontSize: 12, color: '#6B7280' }}>
                  <span style={{ fontWeight: 600 }}>Đã dùng lúc: </span>
                  {formatDate(userVoucher.usedAt)}
                </p>
              )}
            </Box>

            {/* Store */}
            {userVoucher.storeName && (
              <Box>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                  Cửa hàng áp dụng
                </p>
                <p style={{ fontSize: 12, color: '#444' }}>• {userVoucher.storeName}</p>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Sheet>
  );
};

export default VoucherDetailSheet;
