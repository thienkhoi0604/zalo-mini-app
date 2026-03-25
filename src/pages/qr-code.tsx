import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Page, useSnackbar } from 'zmp-ui';
import { useUserStore } from 'stores/user';
import { ImageSkeleton } from 'components/skeletons';
import { checkin, CheckinPayload } from 'apis/checkins';

async function getZaloLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  const { getLocation } = await import('zmp-sdk');
  return new Promise((resolve, reject) => {
    getLocation({
      success: (res: any) => {
        console.log('Zalo location response:', res);
        if (res?.latitude && res?.longitude) {
          resolve({ latitude: res.latitude, longitude: res.longitude });
        } else {
          reject(new Error('Không lấy được vị trí'));
        }
      },
      fail: (err: any) => reject(err),
    });
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const QRCodePage: FC = () => {
  const { user, qrCodeUrl, qrLoading, loadQRCode } = useUserStore();
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
    setScanLoading(true);
    try {
      // Bước 1: Xin quyền và lấy tọa độ GPS trước khi mở camera
      let latitude = 0;
      let longitude = 0;
      try {
        const location = await getZaloLocation();
        latitude = location.latitude;
        longitude = location.longitude;
        console.log('User location:', location);
      } catch {
        openSnackbar({
          text: 'Bạn cần cấp quyền vị trí để checkin tại trạm',
          type: 'warning',
        });
        // Nếu user từ chối cấp quyền vị trí, vẫn cho phép quét QR nhưng sẽ dùng tọa độ mặc định (ví dụ: trung tâm thành phố)
        latitude = 10.7709187;
        longitude = 106.6674697;
      }

      // Bước 2: Mở camera quét QR
      const zaloSdk = await import('zmp-sdk');
      if (typeof zaloSdk.scanQRCode !== 'function') {
        openSnackbar({
          text: 'Tính năng quét QR chưa được hỗ trợ',
          type: 'error',
        });
        return;
      }

      const scanData = await zaloSdk.scanQRCode();
      console.log('Raw scan data:', scanData);
      if (!scanData) return;

      // Bước 3: Lấy raw string từ kết quả quét
      const rawString: string = (scanData as any)?.content ?? String(scanData);
      console.log('rawString from QR scan:', rawString);

      // Bước 4: Gọi API checkin
      const payload: CheckinPayload = {
        stationCode: rawString,
        vehicleTypeCode: 'ELECTRIC_CAR', // Tạm thời hardcode, có thể mở rộng sau
        checkinAt: new Date().toISOString(),
        latitude,
        longitude,
      };

      const response = await checkin(payload);

      const points = response?.data?.points;
      openSnackbar({
        text: points
          ? `Checkin thành công! Nhận được ${points} điểm 🎉`
          : 'Checkin thành công!',
        type: 'success',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message;
      openSnackbar({
        text: message || 'Có lỗi xảy ra khi quét mã QR',
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
          <Button
            className="w-full"
            onClick={handleScanQR}
            loading={scanLoading}
          >
            {scanLoading ? 'Đang xử lý...' : 'Bắt đầu quét mã QR'}
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
                  src={getMockQRUrl() || (qrCodeUrl as string)}
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
