import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { MapPin, Navigation, Zap } from 'lucide-react';
import type { Station } from '@/types/station';
import CoinIcon from '@/components/ui/coin-icon';
import logoImg from '@/assets/images/logo.png';
import { formatDistance } from '@/utils/format';

interface Props {
  station: Station;
  onClick: () => void;
}

const FALLBACK_IMG = logoImg;

const StationCard: FC<Props> = ({ station, onClick }) => {
  const address = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  const powerValues = (station.pillarConfigs ?? [])
    .map((p) => parseFloat(p.powerKW))
    .filter((v) => !isNaN(v));
  const minPower = powerValues.length ? Math.min(...powerValues) : null;
  const maxPower = powerValues.length ? Math.max(...powerValues) : null;
  const powerLabel =
    minPower !== null && maxPower !== null
      ? minPower === maxPower
        ? `${minPower} kW`
        : `${minPower}–${maxPower} kW`
      : null;

  const distanceText = formatDistance(station.distanceKm);

  return (
    <Box
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
        border: '1px solid #F0F4F0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      {/* ── Header ── */}
      <Box
        style={{
          background: '#fff',
          padding: '10px 12px',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#111827',
            lineHeight: '18px',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {station.name}
        </p>
      </Box>

      {/* ── Body ── */}
      <Box flex style={{ flex: 1, minHeight: 0 }}>
        {/* Image — full height left column */}
        <Box
          style={{
            width: '32%',
            flexShrink: 0,
            position: 'relative',
            background: '#F0F4F0',
            overflow: 'hidden',
            alignSelf: 'stretch',
          }}
        >
          <img
            src={station.imageUrl ?? FALLBACK_IMG}
            alt={station.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
        </Box>

        {/* Info */}
        <Box style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px 12px 11px' }}>
          {/* Address */}
          {address && (
            <Box flex className="items-start" style={{ gap: 4 }}>
              <MapPin size={11} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
              <p
                style={{
                  fontSize: 11,
                  color: '#6B7280',
                  lineHeight: '15px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {address}
              </p>
            </Box>
          )}

          {/* Station type + power */}
          {(station.stationTypeName || powerLabel) && (
            <Box flex className="items-center" style={{ gap: 5, flexWrap: 'wrap' }}>
              {station.stationTypeName && (
                <Box
                  style={{
                    background: '#EEF7F1',
                    border: '1px solid #A7F3D0',
                    borderRadius: 6,
                    padding: '2px 8px',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#288F4E' }}>{station.stationTypeName}</p>
                </Box>
              )}
              {powerLabel && (
                <Box
                  flex
                  className="items-center"
                  style={{
                    gap: 3,
                    background: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    borderRadius: 6,
                    padding: '2px 7px',
                  }}
                >
                  <Zap size={9} color="#EA580C" strokeWidth={2.5} />
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#EA580C' }}>{powerLabel}</p>
                </Box>
              )}
            </Box>
          )}

          {/* Chips row */}
          <Box flex className="items-center" style={{ gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
            {distanceText && (
              <Box
                flex
                className="items-center"
                style={{
                  gap: 3,
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: 20,
                  padding: '2px 7px',
                }}
              >
                <Navigation size={9} color="#0284C7" />
                <p style={{ fontSize: 10, fontWeight: 600, color: '#0284C7' }}>{distanceText}</p>
              </Box>
            )}

            {station.defaultPoint != null && (
              <Box
                flex
                className="items-center"
                style={{
                  gap: 3,
                  background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                  border: '1px solid #FCD34D',
                  borderRadius: 20,
                  padding: '2px 7px',
                }}
              >
                <CoinIcon size={11} />
                <p style={{ fontSize: 10, fontWeight: 700, color: '#92400E' }}>+{station.defaultPoint}</p>
              </Box>
            )}


          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StationCard;
