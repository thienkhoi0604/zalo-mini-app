import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Store, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';
import ViewAllFab from '@/components/ui/view-all-fab';
import { getStores, AppStore } from '@/api/stores';
import defaultStoreImg from '@/assets/images/logo.png';
import { formatDistance } from '@/utils/format';

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export const StoreSkeleton: FC = () => (
  <Box
    className="animate-pulse"
    style={{
      width: 290,
      flexShrink: 0,
      background: '#fff',
      borderRadius: 18,
      overflow: 'hidden',
      border: '1px solid #F3F4F6',
    }}
  >
    <Box style={{ padding: '12px 14px 10px', borderBottom: '1px solid #F3F4F6' }}>
      <Box style={{ height: 16, width: '55%', background: '#E9EBED', borderRadius: 6, margin: '0 auto' }} />
    </Box>
    <Box style={{ display: 'flex', minHeight: 100 }}>
      <Box style={{ width: '36%', flexShrink: 0, background: '#E9EBED' }} />
      <Box style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box style={{ height: 10, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '60%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '50%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ marginTop: 'auto', height: 20, width: '60%', background: '#E9EBED', borderRadius: 10 }} />
      </Box>
    </Box>
  </Box>
);

// ─── Info row helper ───────────────────────────────────────────────────────────

export const InfoRow: FC<{ icon: React.ReactNode; text: string; clamp?: number }> = ({ icon, text, clamp = 1 }) => (
  <Box flex className="items-start" style={{ gap: 6 }}>
    <Box style={{ marginTop: 1, flexShrink: 0 }}>{icon}</Box>
    <p
      style={{
        fontSize: 11.5,
        color: '#6B7280',
        lineHeight: '16px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: clamp,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {text}
    </p>
  </Box>
);

// ─── Store Card ────────────────────────────────────────────────────────────────

const STORE_CARD_W = 290;

export const StoreCard: FC<{ store: AppStore; onCardClick: () => void }> = ({ store, onCardClick }) => {
  const distanceLabel = formatDistance(store.distanceKm);

  const hoursLabel = store.openTime && store.closeTime
    ? `${store.openTime} – ${store.closeTime}`
    : store.operatingHours ?? null;

  return (
    <Box
      onClick={onCardClick}
      style={{
        width: STORE_CARD_W,
        flexShrink: 0,
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #F0F1F3',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        cursor: 'pointer',
      }}
    >
      {/* ── Header ── */}
      <Box
        style={{
          padding: '10px 14px 9px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#111827',
            lineHeight: '20px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {store.name}
        </p>
      </Box>

      {/* ── Body ── */}
      <Box style={{ display: 'flex', minHeight: 100 }}>

        {/* Left: image */}
        <Box
          style={{
            width: '36%',
            flexShrink: 0,
            position: 'relative',
            background: '#F3F4F6',
            overflow: 'hidden',
            alignSelf: 'stretch',
          }}
        >
          <img
            src={store.imageUrl ?? store.storeImageUrl ?? defaultStoreImg}
            alt={store.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).src = defaultStoreImg; }}
          />
        </Box>

        {/* Right: info */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px 10px 11px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {store.address && (
            <InfoRow icon={<MapPin size={11} color="#9CA3AF" />} text={store.address} clamp={2} />
          )}
          {hoursLabel && (
            <InfoRow icon={<Clock size={11} color="#9CA3AF" />} text={hoursLabel} />
          )}
          {store.phone && (
            <InfoRow icon={<Phone size={11} color="#9CA3AF" />} text={store.phone} />
          )}

          {distanceLabel && (
            <Box
              flex
              className="items-center"
              style={{
                gap: 4,
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 20,
                padding: '3px 9px',
                display: 'inline-flex',
                alignSelf: 'flex-start',
                marginTop: 2,
              }}
            >
              <Navigation size={9} color="#288F4E" strokeWidth={2.5} />
              <p style={{ fontSize: 10.5, color: '#288F4E', fontWeight: 700 }}>{distanceLabel}</p>
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
};

// ─── Store list section ────────────────────────────────────────────────────────

const MAX_VISIBLE_STORES = 5;

const StoreListSection: FC<{ stores: AppStore[] }> = ({ stores }) => {
  const navigate = useNavigate();

  if (stores.length === 0) return null;

  const visible = stores.slice(0, MAX_VISIBLE_STORES);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <SectionHeader
        title="Danh mục cửa hàng"
        icon={<Store size={14} color="#fff" />}
        onViewAll={() => navigate('/stores')}
      />

      {/* Horizontal scroll */}
      <Box
        flex
        style={{
          overflowX: 'auto',
          padding: '4px 14px 16px',
          gap: 10,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
        }}
      >
        {visible.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onCardClick={() => navigate(`/stores/${store.id}`)}
          />
        ))}
        <ViewAllFab onClick={() => navigate('/stores')} />
      </Box>
    </Box>
  );
};

// ─── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: FC = () => (
  <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 14 }}>
    <Box
      style={{
        width: 84, height: 84, borderRadius: '50%',
        background: 'linear-gradient(145deg, #F0FDF4, #DCFCE7)',
        boxShadow: '0 6px 20px rgba(40,143,78,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Store size={36} color="#288F4E" />
    </Box>
    <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ fontSize: 16, fontWeight: 800, color: '#374151' }}>Chưa có cửa hàng</p>
      <p style={{ fontSize: 13, color: '#9CA3AF' }}>Hãy quay lại sau nhé!</p>
    </Box>
  </Box>
);

// ─── Store Tab ─────────────────────────────────────────────────────────────────

const StoreTab: FC = () => {
  const [stores, setStores] = useState<AppStore[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getStores({ pageSize: 100 });
    setStores(result.items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const isEmpty = !loading && stores.length === 0;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8, paddingBottom: 16 }}>
      {loading ? (
        <Box flex style={{ gap: 10, padding: '4px 14px 16px', overflowX: 'hidden' }}>
          <StoreSkeleton />
          <StoreSkeleton />
          <StoreSkeleton />
        </Box>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <StoreListSection stores={stores} />
      )}
    </Box>
  );
};

export default StoreTab;
