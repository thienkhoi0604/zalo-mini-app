import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Zap } from 'lucide-react';

export interface VehicleType {
  code: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const VEHICLE_TYPE_IDS: Record<string, string> = {
  ELECTRIC_CAR: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

export const VEHICLE_TYPES: VehicleType[] = [
  {
    code: 'ELECTRIC_CAR',
    label: 'Xe điện',
    icon: <Zap size={22} color="#288F4E" fill="#288F4E" strokeWidth={0} />,
    description: 'Ô tô điện, xe máy điện',
  },
];

interface Props {
  value: string;
  onChange: (code: string) => void;
}

const VehicleTypeSelector: FC<Props> = ({ value, onChange }) => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {VEHICLE_TYPES.map((type) => {
      const selected = value === type.code;
      return (
        <Box
          key={type.code}
          flex
          className="items-center rounded-2xl cursor-pointer"
          onClick={() => onChange(type.code)}
          style={{
            padding: '14px 16px',
            gap: 14,
            background: selected ? '#EEF7F1' : '#F9FAFB',
            border: `2px solid ${selected ? '#288F4E' : '#E5E7EB'}`,
            transition: 'all 0.2s',
          }}
        >
          <Box
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              background: selected ? '#D1FAE5' : '#F3F4F6',
            }}
          >
            {type.icon}
          </Box>
          <Box style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: selected ? '#1A6B38' : '#111827' }}>
              {type.label}
            </p>
            <p style={{ fontSize: 12, color: selected ? '#288F4E' : '#9CA3AF', marginTop: 2 }}>
              {type.description}
            </p>
          </Box>
          <Box
            className="rounded-full flex-shrink-0"
            style={{
              width: 20,
              height: 20,
              border: `2px solid ${selected ? '#288F4E' : '#D1D5DB'}`,
              background: selected ? '#288F4E' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected && (
              <Box
                className="rounded-full"
                style={{ width: 8, height: 8, background: '#fff' }}
              />
            )}
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default VehicleTypeSelector;
