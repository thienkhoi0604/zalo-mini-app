import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Page, useSnackbar } from 'zmp-ui';
import { useUserStore } from 'stores/user';
import { ImageSkeleton } from 'components/skeletons';
import { checkin } from 'apis/checkins';
import { getZaloLocationToken, getZaloAccessToken } from 'helpers/user';

// ─── Component ────────────────────────────────────────────────────────────────

const QRCodePage: FC = () => {
  const { user, qrCodeUrl, qrLoading, loadQRCode } = useUserStore();
  const { openSnackbar } = useSnackbar();
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    if (user?.id) loadQRCode();
  }, [user?.id, loadQRCode]);

  const handleScanQR = async () => {
    setScanLoading(true);
    try {
      // Bước 1: Lấy Zalo access token và location token song song
      const [zaloAccessToken, locationToken] = await Promise.all([
        getZaloAccessToken(),
        getZaloLocationToken(),
      ]);

      // Bước 2: Mở camera quét QR
      const { scanQRCode } = await import('zmp-sdk');
      if (typeof scanQRCode !== 'function') {
        throw new Error('Tính năng quét QR chưa được hỗ trợ');
      }

      const scanData = await scanQRCode();
      if (!scanData) return;

      // Bước 3: Lấy station code từ kết quả quét
      const stationCode: string = (scanData as any)?.content ?? String(scanData);

      // Bước 4: Gọi API checkin
      const response = await checkin({
        stationCode,
        vehicleTypeCode: 'ELECTRIC_CAR',
        checkinAt: new Date().toISOString(),
        zaloAccessToken,
        code: locationToken,
      });

      const points = response?.data?.points;
      openSnackbar({
        text: points
          ? `Checkin thành công! Nhận được ${points} điểm 🎉`
          : 'Checkin thành công!',
        type: 'success',
      });
    } catch (error: any) {
      openSnackbar({
        text: error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi quét mã QR',
        type: 'error',
      });
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex flex-col p-4 space-y-4">
        <p className="text-base font-semibold text-gray-900">QR Code</p>

        {/* Scan section */}
        <Box className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
          <p className="text-sm font-semibold text-blue-900">
            📱 Quét mã trạm sạc
          </p>
          <p className="text-sm text-gray-600">
            Quét mã QR tại trạm sạc để checkin và nhận điểm tích lũy
          </p>
          <Button className="w-full" onClick={handleScanQR} loading={scanLoading}>
            Bắt đầu quét mã QR
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
                  src={qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=userid:${user?.id ?? 'EcoGreen'}`}
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
