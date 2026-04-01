import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { MapPin, Zap, Navigation, Store } from 'lucide-react';
import type { Station } from '@/types/station';

interface Props {
  station: Station;
  onClick: () => void;
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80&auto=format';

const StationCard: FC<Props> = ({ station, onClick }) => {
  const address = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  const distanceText =
    station.distanceKm != null && station.distanceKm > 0
      ? station.distanceKm < 1
        ? `${Math.round(station.distanceKm * 1000)} m`
        : `${station.distanceKm.toFixed(1)} km`
      : null;

  return (
    <Box
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
        border: '1px solid #F0F4F0',
        marginBottom: 14,
      }}
      onClick={onClick}
    >
      {/* Image with gradient overlay */}
      <Box style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img
          src={station.imageUrl ?? FALLBACK_IMG}
          alt={station.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        {/* Gradient overlay */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.52) 100%)',
          }}
        />

        {/* Status badge — top left */}
        <Box
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: station.isActive ? 'rgba(34,197,94,0.92)' : 'rgba(107,114,128,0.88)',
            borderRadius: 100,
            padding: '3px 9px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: station.isActive ? '0 0 0 2px rgba(255,255,255,0.4)' : 'none',
            }}
          />
          <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>
            {station.isActive ? 'Đang hoạt động' : 'Tạm ngừng'}
          </p>
        </Box>

        {/* Points badge — top right */}
        {station.defaultPoint != null && (
          <Box
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 100,
              padding: '4px 10px',
              boxShadow: '0 2px 8px rgba(217,119,6,0.4)',
            }}
          >
            <Zap size={11} color="#fff" fill="#fff" strokeWidth={0} />
            <p style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>
              +{station.defaultPoint} xu
            </p>
          </Box>
        )}

        {/* Station type — bottom overlay */}
        <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px' }}>
          <Box
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 6,
              padding: '2px 8px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
              {station.stationTypeName}
            </p>
          </Box>
        </Box>
      </Box>

      {/* Bottom info section */}
      <Box style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {/* Station name */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#111827',
            lineHeight: '19px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {station.name}
        </p>
        {/* Address */}
        <Box flex className="items-start" style={{ gap: 5 }}>
          <MapPin size={12} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
          <p
            style={{
              fontSize: 12,
              color: '#6B7280',
              lineHeight: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {address}
          </p>
        </Box>

        {/* Chips row */}
        <Box flex className="items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
          {distanceText && (
            <Box
              flex
              className="items-center"
              style={{
                gap: 4,
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: 20,
                padding: '3px 9px',
              }}
            >
              <Navigation size={10} color="#0284C7" />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#0284C7' }}>{distanceText}</p>
            </Box>
          )}

          {station.storeName && (
            <Box
              flex
              className="items-center"
              style={{
                gap: 4,
                background: '#F5F3FF',
                border: '1px solid #DDD6FE',
                borderRadius: 20,
                padding: '3px 9px',
              }}
            >
              <Store size={10} color="#7C3AED" />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#7C3AED',
                  maxWidth: 120,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {station.storeName}
              </p>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StationCard;
