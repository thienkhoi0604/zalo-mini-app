import React, { FC } from 'react';
import { Box } from 'zmp-ui';

const HistorySkeleton: FC = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[1, 2, 3, 4].map((i) => (
      <Box
        key={i}
        className="bg-white rounded-2xl px-4 py-3 animate-pulse"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Box flex className="items-center" style={{ gap: 12 }}>
          <Box className="rounded-full bg-gray-100 flex-shrink-0" style={{ width: 44, height: 44 }} />
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box className="rounded bg-gray-100" style={{ height: 14, width: '60%' }} />
            <Box className="rounded bg-gray-100" style={{ height: 12, width: '40%' }} />
          </Box>
          <Box className="rounded-full bg-gray-100" style={{ width: 56, height: 26 }} />
        </Box>
      </Box>
    ))}
  </Box>
);

export default HistorySkeleton;
