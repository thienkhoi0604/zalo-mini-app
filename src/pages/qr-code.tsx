import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Page, useSnackbar } from 'zmp-ui';
import { useUserStore } from 'stores/user';
import { ImageSkeleton } from 'components/skeletons';
import AppHeader from 'components/app-header';

const QRCodePage: FC = () => {
  const { user, qrCodeUrl, qrLoading, loadQRCode, scanQRCode } = useUserStore();
  const { openSnackbar } = useSnackbar();
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    if (user?.id) loadQRCode();
  }, [user?.id]);

  const getMockQRUrl = () => {
    if (!user?.id)
      return 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EcoGreen';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=userid:${user.id}`;
  };

  const handleScanQR = async () => {
    if (!user?.id) {
      openSnackbar({ text: 'Vui lòng đăng nhập để quét mã QR', type: 'error' });
      return;
    }

    setScanLoading(true);
    try {
      const zaloSdk = await import('zmp-sdk');

      if (typeof zaloSdk.scanQRCode !== 'function') {
        openSnackbar({
          text: 'Tính năng quét QR chưa được hỗ trợ',
          type: 'error',
        });
        return;
      }

      const scanData = await zaloSdk.scanQRCode();
      if (!scanData) return;

      const qrString = (scanData as any)?.data || (scanData as any);
      const scannedUserId = qrString?.split(':')?.[1] || qrString;

      if (!scannedUserId) {
        openSnackbar({ text: 'Mã QR không hợp lệ', type: 'error' });
        return;
      }

      const points = await scanQRCode(scannedUserId);
      openSnackbar({ text: `Kiếm được ${points} điểm!`, type: 'success' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message;
      if (errorMessage?.includes('already')) {
        openSnackbar({
          text: 'Bạn đã quét mã người dùng này rồi',
          type: 'error',
        });
      } else if (errorMessage?.includes('not found')) {
        openSnackbar({ text: 'Người dùng không tồn tại', type: 'error' });
      } else {
        openSnackbar({
          text: errorMessage || 'Có lỗi xảy ra khi quét mã QR',
          type: 'error',
        });
      }
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <AppHeader title="" showGreeting />

      <Box className="flex flex-col p-4 space-y-4">
        <p className="text-base font-semibold text-gray-900">QR Code</p>

        {/* Scan section */}
        <Box className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
          <p className="text-sm font-semibold text-blue-900">📱 Quét mã QR</p>
          <p className="text-sm text-gray-600">
            Quét mã QR của người khác để kiếm điểm tích lũy
          </p>
          <Button
            className="w-full"
            onClick={handleScanQR}
            loading={scanLoading}
          >
            {scanLoading ? 'Đang quét...' : 'Bắt đầu quét mã QR'}
          </Button>
        </Box>

        {/* My QR section */}
        <Box className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <p className="text-sm font-semibold text-gray-900">
            🎫 Thẻ QR Code của tôi
          </p>

          {qrLoading ? (
            <div className="flex justify-center">
              <ImageSkeleton className="w-64 h-64 rounded-lg" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl shadow border border-gray-100">
                <img
                  src={getMockQRUrl() || qrCodeUrl}
                  alt="My QR Code"
                  className="w-56 h-56 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EcoGreen';
                  }}
                />
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400">
            💡 Cho người khác quét mã này để họ kiếm điểm
          </p>
        </Box>
      </Box>
    </Page>
  );
};

export default QRCodePage;
