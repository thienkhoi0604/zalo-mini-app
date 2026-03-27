import React, { FC } from 'react';
import { Box } from 'zmp-ui';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  iconBg: string;
}

const StatCard: FC<Props> = ({ icon, label, value, bg, iconBg }) => (
  <Box className="flex-1 rounded-2xl" style={{ background: bg, padding: '12px 14px' }}>
    <Box
      className="flex items-center justify-center rounded-xl"
      style={{ width: 36, height: 36, background: iconBg, marginBottom: 8 }}
    >
      {icon}
    </Box>
    <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 3 }}>{label}</p>
    <p style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{value}</p>
  </Box>
);

export default StatCard;
