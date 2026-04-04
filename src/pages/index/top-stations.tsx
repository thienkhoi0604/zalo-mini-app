import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "zmp-ui";
import { Zap, LayoutGrid } from "lucide-react";
import { Station } from '@/types/station';
import { getStations } from '@/api/stations';
import StationCard from '@/pages/stations/station-card';

const SectionHeader: FC<{ title: string }> = ({ title }) => (
  <Box flex className="items-center px-4 mb-3" style={{ gap: 8 }}>
    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{
        width: 28,
        height: 28,
        background: 'linear-gradient(135deg, #43B96B, #288F4E)',
      }}
    >
      <Zap size={14} color="#fff" fill="#fff" strokeWidth={0} />
    </Box>
    <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{title}</p>
  </Box>
);

export const TopStationsCarousel: FC = () => {
  const navigate = useNavigate();
  const [topStations, setTopStations] = useState<Station[]>([]);

  useEffect(() => {
    getStations({ pageNumber: 1, pageSize: 20 }).then((res) => {
      const sorted = [...(res.data.items ?? [])]
        .sort((a, b) => (b.defaultPoint || 0) - (a.defaultPoint || 0))
        .slice(0, 5);
      setTopStations(sorted);
    });
  }, []);

  if (topStations.length === 0) return null;

  return (
    <Box className="pt-4 pb-2">
      <SectionHeader title="Trạm sạc" />

      {/* Horizontal scroll */}
      <Box
        flex
        style={{
          overflowX: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
          gap: 12,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
        }}
      >
        {topStations.map((station) => (
          <div key={station.id} style={{ width: 280, height: 160, flexShrink: 0 }}>
            <StationCard
              station={station}
              onClick={() => navigate(`/stations/${station.id}`)}
            />
          </div>
        ))}

        {/* View all */}
        <div
          className="flex-shrink-0 cursor-pointer"
          style={{
            width: 64,
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onClick={() => navigate('/stations')}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#288F4E',
              boxShadow: '0 4px 16px rgba(40,143,78,0.28), 0 1px 4px rgba(40,143,78,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LayoutGrid size={18} color="#fff" strokeWidth={2} />
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#288F4E', letterSpacing: 0.3, textAlign: 'center' }}>Tất cả</p>
        </div>
      </Box>
    </Box>
  );
};

export default TopStationsCarousel;
