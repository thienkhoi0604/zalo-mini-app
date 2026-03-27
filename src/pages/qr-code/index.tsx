import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { REDIRECT_DELAY_MS } from '@/constants';
import { runScan, ScanResult } from './scan';
import ScanResultView from './scan-result-view';

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
