import React, { FC } from 'react';
import { Box } from 'zmp-ui';

interface Props {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

const InfoRow: FC<Props> = ({ icon, iconBg, label, value, last }) => (
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
      style={{ width: 38, height: 38, background: iconBg }}
    >
      {icon}
    </Box>
    <Box style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </p>
      <Box>{value}</Box>
    </Box>
  </Box>
);

export default InfoRow;
