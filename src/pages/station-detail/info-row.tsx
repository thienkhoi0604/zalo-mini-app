import React, { FC } from 'react';
import { Box } from 'zmp-ui';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

const InfoRow: FC<Props> = ({ icon, label, value, last }) => (
  <Box
    flex
    className="items-start"
    style={{
      gap: 14,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid #F3F4F6',
    }}
  >
    <Box
      className="flex items-center justify-center rounded-xl flex-shrink-0"
      style={{ width: 36, height: 36, background: '#F3F4F6' }}
    >
      {icon}
    </Box>
    <Box style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>{label}</p>
      <Box>{value}</Box>
    </Box>
  </Box>
);

export default InfoRow;
