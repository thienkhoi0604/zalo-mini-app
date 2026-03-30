import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from 'zmp-ui';
import QRCode from 'react-qr-code';
import { Sheet } from '@/components/fullscreen-sheet';

interface QRCodeSheetProps {
  visible: boolean;
  onClose: () => void;
  fetchData: () => Promise<string>;
  title?: string;
  hint?: string;
}

const QRCodeSheet: FC<QRCodeSheetProps> = ({
  visible,
  onClose,
  fetchData,
  title = 'QR Code của tôi',
  hint = '💡 Cho nhân viên quét mã này để nhận điểm tại trạm sạc',
}) => {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      fetchedRef.current = false;
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    setError(false);

    fetchData()
      .then((value) => {
        setQrValue(value);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={onClose} height={75} swipeToClose unmountOnClose>
      <Box
        className="flex flex-col items-center px-6 pt-2 gap-4"
        style={{ height: '100%', overflowY: 'auto', paddingBottom: 'calc(32px + var(--zaui-safe-area-inset-bottom, 0px))' }}
      >
        <p className="text-base font-bold text-gray-900">{title}</p>

        {loading && (
          <Box
            className="animate-pulse rounded-2xl bg-gray-200"
            style={{ width: 224, height: 224 }}
          />
        )}

        {!loading && error && (
          <Box
            className="flex items-center justify-center rounded-2xl bg-red-50 border border-red-100"
            style={{ width: 224, height: 224 }}
          >
            <p className="text-sm text-red-400">Không tải được mã QR</p>
          </Box>
        )}

        {!loading && !error && qrValue && (
          <Box className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <QRCode
              value={qrValue}
              size={192}
              fgColor="#1a1a1a"
              bgColor="#ffffff"
              style={{ display: 'block' }}
            />
          </Box>
        )}

        <p className="text-xs text-gray-400 text-center">{hint}</p>
      </Box>
    </Sheet>
  );
};

export default QRCodeSheet;
