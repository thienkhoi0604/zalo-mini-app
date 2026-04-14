import React, { FC } from 'react';
import { Box } from 'zmp-ui';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  iconBg: string;
  accent: string;
}

const StatCard: FC<Props> = ({ icon, label, value, bg, iconBg, accent }) => (
  <Box
    className="flex-1 rounded-2xl"
    style={{
      background: bg,
      padding: '12px 12px 14px',
      borderTop: `3px solid ${accent}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}
  >
    <Box
      className="flex items-center justify-center rounded-xl"
      style={{ width: 34, height: 34, background: iconBg, marginBottom: 10 }}
    >
      {icon}
    </Box>
    <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: 0.3, marginBottom: 3, textTransform: 'uppercase' }}>
      {label}
    </p>
    <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: '22px' }}>{value}</p>
  </Box>
);

export default StatCard;
