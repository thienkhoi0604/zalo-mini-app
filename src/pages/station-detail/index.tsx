import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { MapPin, Navigation, Zap, Clock, RotateCcw, Store, Tag } from 'lucide-react';
import { openOutApp } from 'zmp-sdk/apis';
import { Station } from '@/types/station';
import { getStationById } from '@/api/stations';
import StatCard from './stat-card';
import InfoRow from './info-row';
import PullToRefresh from '@/components/ui/pull-to-refresh';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DetailSkeleton: FC = () => (
  <Page className="flex-1 flex flex-col" style={{ background: '#F6F8F6' }}>
    {/* Hero */}
    <Box className="animate-pulse" style={{ height: 260, background: '#D1D5DB' }} />

    <Box style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Stats row */}
      <Box flex style={{ gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            className="flex-1 rounded-2xl animate-pulse"
            style={{ height: 88, background: '#E9EBED' }}
          />
        ))}
      </Box>

      {/* Info card */}
      <Box className="bg-white rounded-2xl animate-pulse" style={{ height: 130, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />

      {/* Maps button */}
      <Box className="bg-white rounded-2xl animate-pulse" style={{ height: 56, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
    </Box>
  </Page>
);

// ─── Section label ─────────────────────────────────────────────────────────────

const SectionLabel: FC<{ children: string }> = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', paddingLeft: 4, marginBottom: 8 }}>
    {children}
  </p>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const StationDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStation = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const s = await getStationById(id);
    setStation(s);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadStation(); }, [loadStation]);

  if (loading) return <DetailSkeleton />;

  if (!station) {
    return (
      <Page className="flex-1 flex flex-col" style={{ background: '#F6F8F6' }}>
        <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 14 }}>
          <Box
            className="flex items-center justify-center rounded-full"
            style={{ width: 80, height: 80, background: 'linear-gradient(145deg, #DCFCE7, #BBF7D0)', boxShadow: '0 4px 16px rgba(40,143,78,0.15)' }}
          >
            <Zap size={36} color="#288F4E" fill="#288F4E" strokeWidth={0} />
          </Box>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Không tìm thấy trạm sạc</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Trạm này có thể đã bị xóa hoặc không tồn tại</p>
        </Box>
      </Page>
    );
  }

  const fullAddress = [station.address, station.wardName, station.provinceName]
    .filter(Boolean)
    .join(', ');

  const distanceLabel =
    station.distanceKm != null && station.distanceKm > 0
      ? station.distanceKm < 1
        ? `${Math.round(station.distanceKm * 1000)} m`
        : `${station.distanceKm.toFixed(1)} km`
      : null;

  const statItems = [
    station.distanceKm != null && station.distanceKm > 0 && {
      icon: <Navigation size={16} color="#0284C7" />,
      label: 'Cách bạn',
      value: distanceLabel!,
      bg: '#F0F9FF',
      iconBg: '#E0F2FE',
      accent: '#38BDF8',
    },
    station.defaultPoint != null && {
      icon: <Zap size={17} color="#D97706" fill="#D97706" strokeWidth={0} />,
      label: 'Xu / check-in',
      value: `+${station.defaultPoint}`,
      bg: '#FFFBEB',
      iconBg: '#FEF3C7',
      accent: '#FBBF24',
    },
    station.maxCheckinPerDay != null && {
      icon: <RotateCcw size={15} color="#288F4E" />,
      label: 'Lần / ngày',
      value: `${station.maxCheckinPerDay}`,
      bg: '#F0FDF4',
      iconBg: '#DCFCE7',
      accent: '#4ADE80',
    },
    station.minCheckinIntervalMinutes != null && {
      icon: <Clock size={15} color="#7C3AED" />,
      label: 'Chu kỳ',
      value: `${station.minCheckinIntervalMinutes} phút`,
      bg: '#F5F3FF',
      iconBg: '#EDE9FE',
      accent: '#A78BFA',
    },
  ].filter(Boolean) as Array<{ icon: React.ReactNode; label: string; value: string; bg: string; iconBg: string; accent: string }>;

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F6F8F6' }}>
      <PullToRefresh onRefresh={loadStation} className="flex-1 pb-8">

        {/* ── Hero ── */}
        <Box style={{ position: 'relative', height: 260 }}>
          <img
            src={station.imageUrl ?? FALLBACK_IMG}
            alt={station.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
          {/* Two-layer gradient: subtle top vignette + strong bottom */}
          <Box style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.62) 100%)' }} />

          {/* Status pill — top left */}
          <Box
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: station.isActive ? 'rgba(22,163,74,0.88)' : 'rgba(107,114,128,0.88)',
              borderRadius: 100,
              padding: '4px 11px',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: station.isActive ? '0 0 0 2px rgba(255,255,255,0.35)' : 'none',
              }}
            />
            <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>
              {station.isActive ? 'Đang hoạt động' : 'Tạm ngừng'}
            </p>
          </Box>

          {/* Points badge — top right */}
          {station.defaultPoint != null && (
            <Box
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                borderRadius: 100,
                padding: '5px 12px',
                boxShadow: '0 3px 10px rgba(217,119,6,0.45)',
              }}
            >
              <Zap size={12} color="#fff" fill="#fff" strokeWidth={0} />
              <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>+{station.defaultPoint} xu</p>
            </Box>
          )}

          {/* Bottom text block */}
          <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 18px' }}>
            {/* Station code chip */}
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 6,
                padding: '2px 8px',
                marginBottom: 8,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Tag size={9} color="rgba(255,255,255,0.8)" />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: 0.5 }}>
                {station.code}
              </p>
            </Box>

            <p
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: '#fff',
                lineHeight: '26px',
                textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                marginBottom: 6,
              }}
            >
              {station.name}
            </p>

            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 8,
                padding: '3px 10px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
                {station.stationTypeName}
              </p>
            </Box>
          </Box>
        </Box>

        <Box style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Stats ── */}
          {statItems.length > 0 && (
            <Box>
              <SectionLabel>Thông số</SectionLabel>
              <Box flex style={{ gap: 10 }}>
                {statItems.map((s, i) => (
                  <StatCard key={i} {...s} />
                ))}
              </Box>
            </Box>
          )}

          {/* ── Info ── */}
          <Box>
            <SectionLabel>Chi tiết</SectionLabel>
            <Box
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <InfoRow
                icon={<MapPin size={16} color="#288F4E" />}
                iconBg="#DCFCE7"
                label="Địa chỉ"
                value={
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: '20px' }}>{fullAddress}</p>
                }
              />
              {station.storeName && (
                <InfoRow
                  icon={<Store size={16} color="#7C3AED" />}
                  iconBg="#EDE9FE"
                  label="Cửa hàng liên kết"
                  value={
                    <p style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{station.storeName}</p>
                  }
                  last
                />
              )}
            </Box>
          </Box>

          {/* ── Google Maps button ── */}
          <button
            onClick={() => openOutApp({ url: station.googleMapsDirectionUrl })}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #1A73E8, #1558B0)',
              border: 'none',
              borderRadius: 16,
              padding: '15px 20px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(26,115,232,0.35)',
            }}
          >
            <Box
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Navigation size={16} color="#fff" />
            </Box>
            <Box style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: '18px' }}>
                Mở trên Google Maps
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
                Chỉ đường đến trạm sạc
              </p>
            </Box>
          </button>

          {/* ── Description ── */}
          {station.description && (
            <Box>
              <SectionLabel>Giới thiệu</SectionLabel>
              <Box
                className="bg-white rounded-2xl"
                style={{
                  padding: '16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  borderLeft: '4px solid #288F4E',
                }}
              >
                <p style={{ fontSize: 13, color: '#4B5563', lineHeight: '22px' }}>
                  {station.description}
                </p>
              </Box>
            </Box>
          )}

        </Box>
      </PullToRefresh>
    </Page>
  );
};

export default StationDetailPage;
