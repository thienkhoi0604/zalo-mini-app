import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { CheckinHistoryItem } from '@/types/checkin';
import { formatTime } from './utils';

const HistoryItem: FC<{ item: CheckinHistoryItem; isLast: boolean }> = ({ item, isLast }) => (
  <Box
    flex
    className="items-center"
    style={{
      padding: '12px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
      gap: 12,
    }}
  >
    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #EEF7F1 0%, #D1ECDB 100%)' }}
    >
      <Zap size={20} color="#288F4E" fill="#288F4E" strokeWidth={0} />
    </Box>

    <Box style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#1a1a1a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.stationName}
      </p>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
        {item.stationTypeName} · {formatTime(item.checkinAt)}
      </p>
    </Box>

    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ background: '#EEF7F1', padding: '4px 10px', minWidth: 56 }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: '#288F4E' }}>+{item.pointEarned} Points</p>
    </Box>
  </Box>
);

export default HistoryItem;
