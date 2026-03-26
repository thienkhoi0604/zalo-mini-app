import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { checkin } from '@/apis/checkins';
import { getZaloLocationToken, getZaloAccessToken } from '@/helpers/user';
import { REDIRECT_DELAY_MS } from '@/constants';

type ScanResult =
  | { status: 'success'; points?: number }
  | { status: 'error'; message: string }
  | { status: 'cancelled' };

async function runScan(): Promise<ScanResult> {
  try {
    const [zaloAccessToken, locationToken] = await Promise.all([
      getZaloAccessToken(),
      getZaloLocationToken(),
    ]);

    const { scanQRCode } = await import('zmp-sdk');
    if (typeof scanQRCode !== 'function') {
      throw new Error('Tính năng quét QR chưa được hỗ trợ');
    }

    const scanData = await scanQRCode();
    if (!scanData) return { status: 'cancelled' };

    const raw = scanData as { content?: string } | string;
    const stationCode = typeof raw === 'object' && raw.content ? raw.content : String(raw);

    const response = await checkin({
      stationCode,
      vehicleTypeCode: 'ELECTRIC_CAR',
      checkinAt: new Date().toISOString(),
      zaloAccessToken,
      code: locationToken,
    });

    return { status: 'success', points: response?.data?.points };
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      status: 'error',
      message: err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra khi quét mã QR',
    };
  }
}

// ─── Result UI ────────────────────────────────────────────────────────────────

const ScanResultView: FC<{ result: ScanResult }> = ({ result }) => {
  if (result.status === 'success') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>🎉</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#288F4E' }}>Checkin thành công!</p>
        {result.points != null && result.points > 0 && (
          <Box
            className="flex items-center justify-center rounded-2xl px-5 py-3"
            style={{ background: '#EEF7F1', gap: 8 }}
          >
            <span style={{ fontSize: 22 }}>🪙</span>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#288F4E' }}>
              +{result.points} điểm
            </p>
          </Box>
        )}
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Đang chuyển về trang cá nhân...
        </p>
      </Box>
    );
  }

  if (result.status === 'error') {
    return (
      <Box className="flex flex-col items-center" style={{ gap: 12 }}>
        <span style={{ fontSize: 56 }}>❌</span>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#EF4444' }}>Checkin thất bại</p>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', maxWidth: 260 }}>
          {result.message}
        </p>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          Đang chuyển về trang cá nhân...
        </p>
      </Box>
    );
  }

  return null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const QRCodePage: FC = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    runScan().then((res) => {
      if (res.status === 'cancelled') {
        navigate('/profile', { replace: true });
        return;
      }
      setResult(res);
      setTimeout(() => navigate('/profile', { replace: true }), REDIRECT_DELAY_MS);
    });
  }, []);

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex-1 flex flex-col items-center justify-center px-6">
        {result ? (
          <ScanResultView result={result} />
        ) : (
          <p style={{ fontSize: 15, color: '#555' }}>Đang mở camera quét QR...</p>
        )}
      </Box>
    </Page>
  );
};

export default QRCodePage;
