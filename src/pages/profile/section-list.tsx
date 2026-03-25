import React, { FC } from 'react';
import { Box, Icon } from 'zmp-ui';

export interface SectionItem {
  icon: string;
  label: string;
  sub?: string;
  badge?: number;
  rightLabel?: string;
  toggle?: boolean;
  toggleValue?: boolean;
}

interface SectionListProps {
  title: string;
  items: SectionItem[];
  onClick: () => void;
}

const SectionList: FC<SectionListProps> = ({ title, items, onClick }) => (
  <Box className="mx-4 mt-3 rounded-2xl overflow-hidden bg-white shadow-sm">
    <p
      style={{
        fontWeight: 700,
        fontSize: 15,
        color: '#1a1a1a',
        padding: '14px 16px 4px',
      }}
    >
      {title}
    </p>
    {items.map((item, i) => (
      <Box
        key={i}
        flex
        className="items-center"
        onClick={item.toggle ? undefined : onClick}
        style={{
          padding: '13px 16px',
          borderTop: i === 0 ? 'none' : '1px solid #F3F3F3',
          cursor: item.toggle ? 'default' : 'pointer',
          gap: 12,
        }}
      >
        {/* Left icon */}
        <Box
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 36, height: 36, background: '#F5F0E8' }}
        >
          <Icon icon={item.icon} style={{ fontSize: 18, color: '#A0784A' }} />
        </Box>

        {/* Label */}
        <Box style={{ flex: 1 }}>
          <Box flex className="items-center" style={{ gap: 6 }}>
            <p style={{ fontSize: 14, color: '#1a1a1a' }}>{item.label}</p>
            {item.badge !== undefined && (
              <Box
                className="flex items-center justify-center rounded-full"
                style={{
                  background: '#EF4444',
                  minWidth: 20,
                  height: 20,
                  padding: '0 5px',
                }}
              >
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </span>
              </Box>
            )}
          </Box>
          {item.sub && (
            <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
              {item.sub}
            </p>
          )}
        </Box>

        {/* Right */}
        {item.rightLabel && (
          <p style={{ fontSize: 14, color: '#A0784A', fontWeight: 500 }}>
            {item.rightLabel}
          </p>
        )}
        {item.toggle ? (
          <Box
            className="rounded-full flex items-center"
            style={{
              width: 44,
              height: 26,
              background: item.toggleValue ? '#C49A6C' : '#D1D5DB',
              padding: 3,
              transition: 'background 0.2s',
            }}
          >
            <Box
              className="rounded-full bg-white shadow"
              style={{
                width: 20,
                height: 20,
                transform: item.toggleValue
                  ? 'translateX(18px)'
                  : 'translateX(0)',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        ) : (
          !item.rightLabel && (
            <Icon
              icon="zi-chevron-right"
              style={{ color: '#B0B0B0', fontSize: 18 }}
            />
          )
        )}
      </Box>
    ))}
  </Box>
);

export default SectionList;
