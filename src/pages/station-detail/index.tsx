import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { MapPin, Navigation, Zap, Clock, RotateCcw, Store } from 'lucide-react';
import { MOCK_STATIONS } from '@/apis/stations';
import StatCard from './stat-card';
import InfoRow from './info-row';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format';

const StationDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const station = useMemo(() => MOCK_STATIONS.find((s) => s.id === id), [id]);

  if (!station) {
    return (
      <Page className="flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>
        <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 12 }}>
          <Box
            className="flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, background: '#EEF7F1' }}
          >
            <Zap size={32} color="#288F4E" fill="#288F4E" strokeWidth={0} />
          </Box>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Không tìm thấy trạm sạc</p>
        </Box>
      </Page>
    );
  }

  const fullAddress = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  const hasStats =
    station.defaultPoint != null ||
    station.maxCheckinPerDay != null ||
    station.minCheckinIntervalMinutes != null;

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>
      <Box className="flex-1 overflow-auto pb-6">

        {/* Hero image with gradient overlay */}
        <Box style={{ position: 'relative', height: 220 }}>
          <img
            src={station.imageUrl ?? FALLBACK_IMG}
            alt={station.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
            }}
          >
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: station.isActive ? 'rgba(34,197,94,0.9)' : 'rgba(156,163,175,0.9)',
                borderRadius: 100,
                padding: '3px 10px',
                marginBottom: 8,
                gap: 5,
              }}
            >
              <Box style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>
                {station.isActive ? 'Đang hoạt động' : 'Tạm ngừng'}
              </p>
            </Box>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: '24px' }}>
              {station.name}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
              {station.stationTypeName}
            </p>
          </Box>
        </Box>

        <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 16px 0' }}>

          {/* Stats row */}
          {hasStats && (
            <Box flex style={{ gap: 10 }}>
              {station.defaultPoint != null && (
                <StatCard
                  icon={<Zap size={18} color="#D97706" fill="#D97706" strokeWidth={0} />}
                  label="Xu / check-in"
                  value={`+${station.defaultPoint}`}
                  bg="#FFFBEB"
                  iconBg="#FEF3C7"
                />
              )}
              {station.maxCheckinPerDay != null && (
                <StatCard
                  icon={<RotateCcw size={16} color="#288F4E" />}
                  label="Check-in / ngày"
                  value={`${station.maxCheckinPerDay} lần`}
                  bg="#EEF7F1"
                  iconBg="#D1FAE5"
                />
              )}
              {station.minCheckinIntervalMinutes != null && (
                <StatCard
                  icon={<Clock size={16} color="#2563EB" />}
                  label="Khoảng cách"
                  value={`${station.minCheckinIntervalMinutes} phút`}
                  bg="#EFF6FF"
                  iconBg="#DBEAFE"
                />
              )}
            </Box>
          )}

          {/* Info card */}
          <Box
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            <InfoRow
              icon={<MapPin size={16} color="#288F4E" />}
              label="Địa chỉ"
              value={
                <p style={{ fontSize: 13, color: '#374151', lineHeight: '19px' }}>{fullAddress}</p>
              }
            />
            <InfoRow
              icon={<Navigation size={16} color="#2563EB" />}
              label="Chỉ đường"
              value={
                <a
                  href={station.googleMapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}
                >
                  Mở trên Google Maps →
                </a>
              }
              last={!station.storeName}
            />
            {station.storeName && (
              <InfoRow
                icon={<Store size={16} color="#7C3AED" />}
                label="Cửa hàng liên kết"
                value={
                  <p style={{ fontSize: 13, color: '#374151' }}>{station.storeName}</p>
                }
                last
              />
            )}
          </Box>

          {/* Description */}
          {station.description && (
            <Box
              className="bg-white rounded-2xl"
              style={{ padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
            >
              <Box flex className="items-center" style={{ gap: 8, marginBottom: 10 }}>
                <Box
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 28, height: 28, background: '#EEF7F1' }}
                >
                  <Zap size={14} color="#288F4E" />
                </Box>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Giới thiệu</p>
              </Box>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: '20px' }}>
                {station.description}
              </p>
            </Box>
          )}

        </Box>
      </Box>
    </Page>
  );
};

export default StationDetailPage;
