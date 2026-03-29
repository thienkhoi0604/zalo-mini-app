import React, { FC, useEffect, useState } from 'react';
import { Box } from 'zmp-ui';
import QRCode from 'react-qr-code';
import { Sheet } from '@/components/fullscreen-sheet';
import { fetchReferralQR } from '@/apis/user';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const QRCodeSheet: FC<Props> = ({ visible, onClose }) => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchReferralQR().then((data) => {
      setQrData(data);
      setLoading(false);
    });
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={onClose} autoHeight swipeToClose unmountOnClose>
      <Box className="flex flex-col items-center px-6 pt-2 pb-8" style={{ gap: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>QR Code của tôi</p>

        {loading || !qrData ? (
          <Box
            className="animate-pulse rounded-2xl"
            style={{ width: 224, height: 224, background: '#E9EBED' }}
          />
        ) : (
          <Box
            className="bg-white rounded-2xl shadow border border-gray-100"
            style={{ padding: 16 }}
          >
            <QRCode
              value={qrData}
              size={192}
              fgColor="#1a1a1a"
              bgColor="#ffffff"
              style={{ display: 'block' }}
            />
          </Box>
        )}

        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          💡 Cho người khác quét mã này để lấy điểm giới thiệu
        </p>
      </Box>
    </Sheet>
  );
};

export default QRCodeSheet;
