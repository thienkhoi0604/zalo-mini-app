import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "zmp-ui";
import { Zap, ChevronRight, MapPin, Navigation } from "lucide-react";
import { Station } from '@/types/station';
import { getStations } from '@/api/stations';

const SectionHeader: FC<{ title: string; onViewAll: () => void }> = ({ title, onViewAll }) => (
  <Box flex className="items-center justify-between px-4 mb-3">
    <Box flex className="items-center" style={{ gap: 8 }}>
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
    <Box
      flex
      className="items-center cursor-pointer"
      style={{ gap: 2 }}
      onClick={onViewAll}
    >
      <p style={{ fontSize: 13, color: '#288F4E', fontWeight: 600 }}>Xem tất cả</p>
      <ChevronRight size={14} color="#288F4E" strokeWidth={2.5} />
    </Box>
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
      <SectionHeader title="Trạm sạc nổi bật" onViewAll={() => navigate('/stations')} />

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
        }}
      >
        {topStations.map((station) => (
          <Box
            key={station.id}
            className="flex-shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer"
            style={{ width: 200, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
            onClick={() => navigate(`/stations/${station.id}`)}
          >
            {/* Image */}
            <Box style={{ height: 100, position: 'relative', overflow: 'hidden', background: '#E9EBED' }}>
              <img
                src={station.imageUrl ?? ''}
                alt={station.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Points badge */}
              {station.defaultPoint != null && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)',
                    borderRadius: 100,
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: 11 }}>🪙</span>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    +{station.defaultPoint}
                  </p>
                </Box>
              )}
            </Box>

            {/* Info */}
            <Box className="p-3" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {station.name}
              </p>

              <Box flex className="items-start" style={{ gap: 4 }}>
                <MapPin size={11} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
                <p
                  style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    lineHeight: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {station.address}
                </p>
              </Box>

              <Box flex className="items-center justify-between">
                <Box
                  style={{
                    background: '#EEF7F1',
                    borderRadius: 6,
                    padding: '3px 8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <p style={{ fontSize: 10, color: '#288F4E', fontWeight: 600 }}>
                    {station.stationTypeName}
                  </p>
                </Box>
                {station.distanceKm != null && station.distanceKm > 0 && (
                  <Box flex className="items-center" style={{ gap: 3 }}>
                    <Navigation size={10} color="#6B7280" />
                    <p style={{ fontSize: 10, color: '#6B7280' }}>
                      {station.distanceKm < 1
                        ? `${Math.round(station.distanceKm * 1000)} m`
                        : `${station.distanceKm.toFixed(1)} km`}
                    </p>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TopStationsCarousel;
