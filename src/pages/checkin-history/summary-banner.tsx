import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { CheckinHistoryItem } from '@/types/checkin';
import { useUserStore } from '@/store/user';

const SummaryBanner: FC<{ history: CheckinHistoryItem[] }> = ({ history }) => {
  const totalPoints = history.reduce((sum, h) => sum + h.pointEarned, 0);
  const { pointWallet } = useUserStore();

  return (
    <Box
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)', padding: '16px 20px' }}
    >
      {/* Top row: earned + icon */}
      <Box flex className="items-center" style={{ marginBottom: 12 }}>
        <Box style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Tổng điểm đã tích</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {totalPoints.toLocaleString('vi-VN')}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            điểm từ {history.length} lần check-in
          </p>
        </Box>
        <Box
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', alignSelf: 'center' }}
        >
          <Zap size={28} color="#fff" fill="#fff" strokeWidth={0} />
        </Box>
      </Box>

      {/* Divider */}
      <Box style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

      {/* Bottom row: current balance */}
      <Box flex className="items-center justify-between">
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Xu hiện tại</p>
        <Box flex className="items-center" style={{ gap: 5 }}>
          <span style={{ fontSize: 15 }}>🪙</span>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
            {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryBanner;
