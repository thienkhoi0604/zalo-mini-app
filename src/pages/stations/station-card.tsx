import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { MapPin, Zap, Clock, Navigation } from 'lucide-react';
import type { Station } from '@/types/station';

interface Props {
  station: Station;
  onClick: () => void;
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80&auto=format';

const StationCard: FC<Props> = ({ station, onClick }) => {
  const address = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  return (
    <Box
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #F0F0F0',
        marginBottom: 12,
      }}
      onClick={onClick}
    >
      <Box flex style={{ height: 110 }}>
        {/* Image */}
        <Box style={{ width: 110, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img
            src={station.imageUrl ?? FALLBACK_IMG}
            alt={station.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
          {/* Active indicator */}
          <Box
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: station.isActive ? '#22C55E' : '#9CA3AF',
              boxShadow: station.isActive ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none',
            }}
          />
        </Box>

        {/* Info */}
        <Box
          className="flex-1"
          style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}
        >
          {/* Top: name + type */}
          <Box>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#111827',
                lineHeight: '18px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: 4,
              }}
            >
              {station.name}
            </p>
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#EEF7F1',
                borderRadius: 6,
                padding: '2px 7px',
              }}
            >
              <p style={{ fontSize: 10, color: '#288F4E', fontWeight: 600 }}>
                {station.stationTypeName}
              </p>
            </Box>
          </Box>

          {/* Bottom: address + points */}
          <Box>
            <Box flex className="items-start" style={{ gap: 4, marginBottom: 6 }}>
              <MapPin size={11} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
              <p
                style={{
                  fontSize: 11,
                  color: '#9CA3AF',
                  lineHeight: '15px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {address}
              </p>
            </Box>

            <Box flex className="items-center justify-between">
              {station.distanceKm != null && station.distanceKm > 0 && (
                <Box flex className="items-center" style={{ gap: 3, marginBottom: 4 }}>
                  <Navigation size={10} color="#6B7280" />
                  <p style={{ fontSize: 10, color: '#6B7280' }}>
                    {station.distanceKm < 1
                      ? `${Math.round(station.distanceKm * 1000)} m`
                      : `${station.distanceKm.toFixed(1)} km`}
                  </p>
                </Box>
              )}
            </Box>
            <Box flex className="items-center justify-between">
              {station.defaultPoint != null ? (
                <Box
                  flex
                  className="items-center"
                  style={{
                    gap: 4,
                    background: 'linear-gradient(135deg, #FEF9EF, #FEF3C7)',
                    border: '1px solid #FDE68A',
                    borderRadius: 8,
                    padding: '3px 8px',
                  }}
                >
                  <Zap size={11} color="#D97706" fill="#D97706" strokeWidth={0} />
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>
                    +{station.defaultPoint} xu
                  </p>
                </Box>
              ) : <Box />}

              {station.minCheckinIntervalMinutes != null && (
                <Box flex className="items-center" style={{ gap: 3 }}>
                  <Clock size={10} color="#9CA3AF" />
                  <p style={{ fontSize: 10, color: '#9CA3AF' }}>
                    {station.minCheckinIntervalMinutes} phút/lần
                  </p>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StationCard;
