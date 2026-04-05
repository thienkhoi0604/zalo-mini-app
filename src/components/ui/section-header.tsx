import React, { FC, ReactNode } from 'react';
import { Box } from 'zmp-ui';

interface SectionHeaderProps {
  title: string;
  icon: ReactNode;
  iconBg?: string;
  /** Extra className appended to the wrapper Box. Defaults to 'mb-3'. */
  className?: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  icon,
  iconBg = '#288F4E',
  className = 'mb-3',
}) => (
  <Box flex className={`items-center px-4 ${className}`} style={{ gap: 8 }}>
    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 28, height: 28, background: iconBg }}
    >
      {icon}
    </Box>
    <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{title}</p>
  </Box>
);

export default SectionHeader;
