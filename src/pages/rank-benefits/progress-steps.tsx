import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { Check } from 'lucide-react';
import { TierConfig } from './tiers';

interface Props {
  tiers: TierConfig[];
  currentCode: string;
}

const ProgressSteps: FC<Props> = ({ tiers, currentCode }) => {
  const sorted = [...tiers].sort((a, b) => a.priority - b.priority);
  const currentIndex = sorted.findIndex((t) => t.code === currentCode);

  return (
    <Box className="bg-white rounded-2xl px-4 py-4">
      <p className="text-xs font-bold text-gray-500 mb-3 uppercase">Lộ trình thăng hạng</p>
      <Box flex className="items-center">
        {sorted.map((tier, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={tier.code}>
              <Box className="flex flex-col items-center">
                <Box
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isCurrent ? 32 : 26,
                    height: isCurrent ? 32 : 26,
                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.3s',
                    background: reached ? tier.gradient : '#E5E7EB',
                  }}
                >
                  {reached ? <Check size={12} color="#fff" /> : <span style={{ fontSize: 12 }}>{tier.emoji}</span>}
                </Box>
                <p className="text-[10px] mt-1">{tier.name}</p>
              </Box>

              {i < sorted.length - 1 && (
                <Box
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 999,
                    background: i < currentIndex ? tier.gradient : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProgressSteps;
