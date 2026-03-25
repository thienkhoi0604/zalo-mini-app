import React, { FC, useEffect } from 'react';
import { Box } from 'zmp-ui';
import { Sheet } from 'components/fullscreen-sheet';
import { useUserStore } from 'stores/user';
import { ImageSkeleton } from 'components/skeletons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const QRCodeSheet: FC<Props> = ({ visible, onClose }) => {
  const { user, qrCodeUrl, qrLoading, loadQRCode } = useUserStore();

  // useEffect(() => {
  //   if (visible && user?.id) loadQRCode();
  // }, [visible, user?.id]);

  return (
    <Sheet visible={visible} onClose={onClose} autoHeight swipeToClose unmountOnClose>
      <Box className="flex flex-col items-center px-6 pt-2 pb-8" style={{ gap: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
          QR Code của tôi
        </p>

        {qrLoading ? (
          <ImageSkeleton className="w-56 h-56 rounded-xl" />
        ) : (
          <Box className="bg-white p-3 rounded-2xl shadow border border-gray-100">
            <img
              src={
                qrCodeUrl ||
                `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=userid:${user?.id ?? 'EcoGreen'}`
              }
              alt="My QR Code"
              style={{ width: 224, height: 224, borderRadius: 12 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EcoGreen';
              }}
            />
          </Box>
        )}

        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          💡 Cho người khác quét mã này để họ kiếm điểm
        </p>
      </Box>
    </Sheet>
  );
};

export default QRCodeSheet;
