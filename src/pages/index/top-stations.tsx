import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "zmp-ui";
import { Zap } from "lucide-react";
import { Station } from '@/types/station';
import { getStations } from '@/api/stations';
import StationCard from '@/pages/stations/station-card';
import SectionHeader from '@/components/ui/section-header';
import ViewAllFab from '@/components/ui/view-all-fab';

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
      <SectionHeader
        title="Trạm sạc"
        icon={<Zap size={14} color="#fff" fill="#fff" strokeWidth={0} />}
        iconBg="linear-gradient(135deg, #43B96B, #288F4E)"
        onViewAll={() => navigate('/stations')}
      />

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
          <div key={station.id} style={{ width: 280, height: 150, flexShrink: 0 }}>
            <StationCard
              station={station}
              isHiddenPower={true}
              onClick={() => {
                sessionStorage.setItem('home-scroll-section', 'section-stations');
                navigate(`/stations/${station.id}`);
              }}
            />
          </div>
        ))}
        {topStations.length > 2 && <ViewAllFab onClick={() => navigate('/stations')} />}
      </Box>
    </Box>
  );
};

export default TopStationsCarousel;
