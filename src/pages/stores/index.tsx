import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { Store, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { getStores, AppStore } from '@/api/stores';
import defaultStoreImg from '@/assets/images/logo.png';
import { InfoRow } from '@/pages/rewards/store-feed';
import { formatDistance } from '@/utils/format';

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const StoreSkeleton: FC = () => (
  <Box
    className="animate-pulse"
    style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #F3F4F6' }}
  >
    <Box style={{ padding: '12px 14px 10px', borderBottom: '1px solid #F3F4F6' }}>
      <Box style={{ height: 16, width: '50%', background: '#E9EBED', borderRadius: 6, margin: '0 auto' }} />
    </Box>
    <Box style={{ display: 'flex', minHeight: 100 }}>
      <Box style={{ width: '36%', flexShrink: 0, background: '#E9EBED' }} />
      <Box style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box style={{ height: 10, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '60%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '50%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ marginTop: 'auto', height: 20, width: '55%', background: '#E9EBED', borderRadius: 10 }} />
      </Box>
    </Box>
  </Box>
);

// ─── Store Card ────────────────────────────────────────────────────────────────

const StoreCard: FC<{ store: AppStore; onClick: () => void }> = ({ store, onClick }) => {
  const distanceLabel = formatDistance(store.distanceKm);

  const hoursLabel = store.openTime && store.closeTime
    ? `${store.openTime} – ${store.closeTime}`
    : store.operatingHours ?? null;

  return (
    <Box
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #F0F1F3',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
    >
      {/* Header */}
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

      {/* Body */}
      <Box style={{ display: 'flex', minHeight: 100 }}>
        {/* Image */}
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
            src={store.imageUrl ?? defaultStoreImg}
            alt={store.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).src = defaultStoreImg; }}
          />
        </Box>

        {/* Info */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px 10px 11px',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
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
                alignSelf: 'flex-start',
                marginTop: 2,
              }}
            >
              <Navigation size={9} color="#288F4E" strokeWidth={2.5} />
              <p style={{ fontSize: 10.5, color: '#288F4E', fontWeight: 700 }}>{distanceLabel}</p>
            </Box>
          )}
          {store.description && (
            <p
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                lineHeight: '15px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                marginTop: 2,
              }}
            >
              {store.description}
            </p>
          )}
        </Box>
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

// ─── Page ──────────────────────────────────────────────────────────────────────

const StoresPage: FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<AppStore[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getStores({ pageSize: 100 });
    setStores(result.items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Page className="flex-1 flex flex-col">
      <PullToRefresh onRefresh={load} className="flex-1">
        <Box style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <>
              <StoreSkeleton />
              <StoreSkeleton />
              <StoreSkeleton />
            </>
          ) : stores.length === 0 ? (
            <EmptyState />
          ) : (
            stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(`/stores/${store.id}`)}
              />
            ))
          )}
        </Box>
      </PullToRefresh>
    </Page>
  );
};

export default StoresPage;
