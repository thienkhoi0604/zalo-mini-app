import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { CheckinHistoryItem } from '@/types/checkin';

const SummaryBanner: FC<{ history: CheckinHistoryItem[] }> = ({ history }) => {
  const totalPoints = history.reduce((sum, h) => sum + h.pointEarned, 0);
  return (
    <Box
      flex
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)', padding: '16px 20px' }}
    >
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
  );
};

export default SummaryBanner;
