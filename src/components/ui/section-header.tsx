import React, { FC, ReactNode } from 'react';
import { Box } from 'zmp-ui';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon: ReactNode;
  iconBg?: string;
  /** Extra className appended to the wrapper Box. Defaults to 'mb-3'. */
  className?: string;
  /** When provided, renders a "View all" button in the top-right corner. */
  onViewAll?: () => void;
}

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  icon,
  iconBg = '#288F4E',
  className = 'mb-3',
  onViewAll,
}) => (
  <Box flex className={`items-center px-4 ${className}`} style={{ gap: 8 }}>
    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 28, height: 28, background: iconBg }}
    >
      {icon}
    </Box>
    <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', flex: 1 }}>{title}</p>
    {onViewAll && (
      <Box
        flex
        className="items-center cursor-pointer"
        style={{ gap: 2 }}
        onClick={onViewAll}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: '#288F4E' }}>Tất cả</p>
        <ChevronRight size={14} color="#288F4E" strokeWidth={2.5} />
      </Box>
    )}
  </Box>
);

export default SectionHeader;
