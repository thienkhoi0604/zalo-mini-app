import React, { FC } from 'react';
import { Box } from 'zmp-ui';

const HistorySkeleton: FC = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {/* Date label skeleton */}
    <Box className="animate-pulse rounded bg-gray-200" style={{ height: 12, width: 80, marginLeft: 4 }} />
    {/* Rows card */}
    <Box
      className="bg-white rounded-2xl overflow-hidden animate-pulse"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}
    >
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          flex
          className="items-center"
          style={{
            padding: '12px 16px',
            borderBottom: i === 3 ? 'none' : '1px solid #F3F4F6',
            gap: 12,
          }}
        >
          <Box className="rounded-full bg-gray-100 flex-shrink-0" style={{ width: 44, height: 44 }} />
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box className="rounded bg-gray-100" style={{ height: 13, width: '65%' }} />
            <Box className="rounded bg-gray-100" style={{ height: 11, width: '45%' }} />
          </Box>
          <Box className="rounded-full bg-gray-100" style={{ width: 60, height: 26 }} />
        </Box>
      ))}
    </Box>
  </Box>
);

export default HistorySkeleton;
