import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate, useLocation } from 'react-router';
import { runScan, ScanResult } from './scan';
import ScanResultView from './scan-result-view';
import { useUserStore } from '@/store/user';

const QRCodePage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<ScanResult | null>(null);
  const scanKey = (location.state as { rescan?: number } | null)?.rescan ?? 0;

  useEffect(() => {
    setResult(null);
    runScan().then((res) => {
      if (res.status === 'cancelled') {
        navigate(-1 as never);
        return;
      }
      setResult(res);
      if (res.status === 'success') {
        useUserStore.getState().loadPointWallet();
      }
    });
  }, [scanKey]);

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
