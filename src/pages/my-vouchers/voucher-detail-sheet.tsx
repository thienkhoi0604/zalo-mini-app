import React, { FC } from 'react';
import { Box, useSnackbar } from 'zmp-ui';
import { Sheet } from 'components/fullscreen-sheet';
import { GiftCard, UserGiftCard } from '@/types/gift-card';

interface Props {
  giftCard: GiftCard | null;
  userVoucher: UserGiftCard | null;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const VoucherDetailSheet: FC<Props> = ({ giftCard, userVoucher, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const isUsed = userVoucher?.status === 'redeemed';

  const handleCopyCode = () => {
    if (!giftCard?.code) return;
    navigator.clipboard
      .writeText(giftCard.code)
      .then(() => openSnackbar({ text: 'Đã sao chép mã voucher!', type: 'success' }))
      .catch(() => openSnackbar({ text: 'Không thể sao chép', type: 'error' }));
  };

  return (
    <Sheet
      visible={!!giftCard && !!userVoucher}
      onClose={onClose}
      autoHeight
      swipeToClose
      unmountOnClose
    >
      {giftCard && userVoucher && (
        <Box className="flex flex-col pb-6">
          {/* Banner */}
          <Box style={{ width: '100%', height: 180, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            <img
              src={giftCard.bannerImageUrl || giftCard.thumbnailImageUrl}
              alt={giftCard.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
              }}
            />
            {isUsed && (
              <Box
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.35)' }}
              >
                <span
                  style={{
                    background: '#6B7280',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '5px 18px',
                    borderRadius: 100,
                    transform: 'rotate(-15deg)',
                    display: 'block',
                  }}
                >
                  Đã sử dụng
                </span>
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box className="px-4 pt-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Category + Name */}
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
                {giftCard.category}
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
                {giftCard.name}
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
                  {giftCard.code}
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
                  {formatDate(giftCard.applicableTimeEnd)}
                </p>
              )}
              {isUsed && userVoucher.redeemedAt && (
                <p style={{ fontSize: 12, color: '#6B7280' }}>
                  <span style={{ fontWeight: 600 }}>Đã dùng lúc: </span>
                  {formatDate(userVoucher.redeemedAt)}
                </p>
              )}
            </Box>

            {/* Applicable stores */}
            {giftCard.stores && giftCard.stores.length > 0 && (
              <Box>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                  Cửa hàng áp dụng ({giftCard.stores.length})
                </p>
                <Box style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {giftCard.stores.slice(0, 3).map((store, i) => (
                    <p key={i} style={{ fontSize: 12, color: '#444', lineHeight: '18px' }}>
                      • {store.address}
                    </p>
                  ))}
                  {giftCard.stores.length > 3 && (
                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>
                      và {giftCard.stores.length - 3} cửa hàng khác...
                    </p>
                  )}
                </Box>
              </Box>
            )}

            {/* Terms */}
            {(giftCard.terms || giftCard.usageGuide || giftCard.programNotes) && (
              <Box>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                  Điều khoản sử dụng
                </p>
                <p style={{ fontSize: 12, color: '#555', lineHeight: '19px' }}>
                  {giftCard.terms || giftCard.usageGuide || giftCard.programNotes}
                </p>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Sheet>
  );
};

export default VoucherDetailSheet;
