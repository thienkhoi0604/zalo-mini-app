import React, { FC, useEffect, useState } from 'react';
import { Box } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { getVehicleTypes, AppVehicleType } from '@/api/user';

// Only ELECTRIC_CAR is shown in the UI; other types are hidden until further notice.
const VISIBLE_CODES = ['ELECTRIC_CAR'];

const LABEL_MAP: Record<string, string> = {
  ELECTRIC_CAR: 'Xe điện',
};

const DESCRIPTION_MAP: Record<string, string> = {
  ELECTRIC_CAR: 'Ô tô điện, xe máy điện',
};

const ICON_MAP: Record<string, React.ReactNode> = {
  ELECTRIC_CAR: <Zap size={22} color="#288F4E" fill="#288F4E" strokeWidth={0} />,
};

interface Props {
  /** UUID of the selected vehicle type (from API). Empty string = nothing selected. */
  value: string;
  onChange: (id: string) => void;
}

const VehicleTypeSelector: FC<Props> = ({ value, onChange }) => {
  const [types, setTypes] = useState<AppVehicleType[]>([]);

  useEffect(() => {
    getVehicleTypes().then((items) => {
      const visible = items.filter((t) => VISIBLE_CODES.includes(t.code) && t.isActive);
      setTypes(visible);
      // Auto-select first visible type if nothing is selected yet
      if (!value && visible.length > 0) {
        onChange(visible[0].id);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {types.map((type) => {
        const selected = value === type.id;
        const label = LABEL_MAP[type.code] ?? type.name;
        const description = DESCRIPTION_MAP[type.code] ?? type.description;
        const icon = ICON_MAP[type.code] ?? <Zap size={22} color="#288F4E" fill="#288F4E" strokeWidth={0} />;

        return (
          <Box
            key={type.id}
            flex
            className="items-center rounded-2xl cursor-pointer"
            onClick={() => onChange(type.id)}
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
              {icon}
            </Box>
            <Box style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: selected ? '#1A6B38' : '#111827' }}>
                {label}
              </p>
              <p style={{ fontSize: 12, color: selected ? '#288F4E' : '#9CA3AF', marginTop: 2 }}>
                {description}
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
};

export default VehicleTypeSelector;
