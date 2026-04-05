import React, { FC, useEffect } from 'react';
import { Box } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Globe, Store, MapPin, Clock, Phone, Navigation, Tag } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher, StoreGroup } from '@/types/voucher';
import VoucherItemCard from './item-card';
import { ACTIVE_THEME } from '@/constants/theme';
import defaultStoreImg from '@/assets/images/logo.png';

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const StoreSkeleton: FC = () => (
  <Box
    className="animate-pulse"
    style={{
      margin: '0 16px',
      background: '#fff',
      borderRadius: 18,
      overflow: 'hidden',
      border: '1px solid #F3F4F6',
    }}
  >
    {/* Header skeleton */}
    <Box style={{ padding: '12px 14px 10px', borderBottom: '1px solid #F3F4F6' }}>
      <Box style={{ height: 18, width: '55%', background: '#E9EBED', borderRadius: 6 }} />
    </Box>
    {/* Body skeleton */}
    <Box style={{ display: 'flex', minHeight: 100 }}>
      <Box style={{ width: '32%', flexShrink: 0, background: '#E9EBED' }} />
      <Box style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box style={{ height: 10, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '60%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '50%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ marginTop: 'auto', height: 44, background: '#E9EBED', borderRadius: 10 }} />
      </Box>
    </Box>
  </Box>
);

const GlobalSkeleton: FC = () => (
  <Box
    className="animate-pulse"
    style={{
      margin: '0 16px',
      borderRadius: 20,
      overflow: 'hidden',
      background: '#E9EBED',
      height: 56,
    }}
  />
);

// ─── Item row (global section) ─────────────────────────────────────────────────

const ItemRow: FC<{ items: Voucher[]; onItemClick: (r: Voucher) => void }> = ({ items, onItemClick }) => (
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
    {items.map((item) => (
      <VoucherItemCard key={item.id} card={item} onClick={onItemClick} />
    ))}
  </Box>
);

// ─── Info row helper ───────────────────────────────────────────────────────────

const InfoRow: FC<{ icon: React.ReactNode; text: string; clamp?: number }> = ({ icon, text, clamp = 1 }) => (
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

const StoreCard: FC<{ group: StoreGroup; onItemClick: (v: Voucher) => void; onCardClick: () => void }> = ({ group, onCardClick }) => {
  const activeCount = group.items.filter((v) => v.status !== 'expired').length;
  const address = group.address ?? group.items[0]?.stores?.[0]?.address ?? null;

  const distanceLabel = group.distanceKm != null
    ? group.distanceKm < 1
      ? `${Math.round(group.distanceKm * 1000)} m`
      : `${group.distanceKm.toFixed(1)} km`
    : null;

  const hoursLabel = group.openFrom && group.openTo
    ? `${group.openFrom} – ${group.openTo}`
    : null;

  return (
    <Box
      onClick={onCardClick}
      style={{
        margin: '0 16px',
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
          gap: 8,
          position: 'relative',
        }}
      >
        <p
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#111827',
            lineHeight: '21px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {group.storeName}
        </p>
      </Box>

      {/* ── Body ── */}
      <Box style={{ display: 'flex', minHeight: 100 }}>

        {/* Left: 16:9 image ~32% */}
        <Box
          style={{
            width: '32%',
            flexShrink: 0,
            position: 'relative',
            background: '#F3F4F6',
            overflow: 'hidden',
            alignSelf: 'stretch',
          }}
        >
          <img
            src={group.imageUrl ?? defaultStoreImg}
            alt={group.storeName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              position: 'absolute',
              inset: 0,
            }}
            onError={(e) => { (e.target as HTMLImageElement).src = defaultStoreImg; }}
          />
        </Box>

        {/* Right: info + voucher count */}
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
          {/* Info rows */}
          {address && (
            <InfoRow icon={<MapPin size={11} color="#9CA3AF" />} text={address} clamp={2} />
          )}
          {hoursLabel && (
            <InfoRow icon={<Clock size={11} color="#9CA3AF" />} text={hoursLabel} />
          )}
          {group.phone && (
            <InfoRow icon={<Phone size={11} color="#9CA3AF" />} text={group.phone} />
          )}

          {/* Distance badge */}
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

          {/* Voucher count */}
          <Box
            style={{
              marginTop: 'auto',
              paddingTop: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Tag size={11} color="#288F4E" />
            <p style={{ fontSize: 11.5, fontWeight: 700, color: '#288F4E' }}>
              {activeCount > 0 ? `${activeCount} ưu đãi` : 'Không có ưu đãi'}
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Global rewards section ────────────────────────────────────────────────────

const GlobalSection: FC<{ vouchers: Voucher[]; onItemClick: (r: Voucher) => void }> = ({ vouchers, onItemClick }) => {
  if (vouchers.length === 0) return null;

  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Gradient card */}
      <Box
        style={{
          margin: '0 16px',
          borderRadius: 20,
          overflow: 'hidden',
          background: gradient,
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        {/* Decorative blobs */}
        <Box style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', bottom: -24, left: 10, width: 70, height: 70, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />

        {/* Header row */}
        <Box
          flex
          className="items-center"
          style={{ padding: '12px 14px 10px', gap: 10, position: 'relative' }}
        >
          <Box
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.26)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Globe size={18} color="#fff" strokeWidth={1.8} />
          </Box>
          <Box>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: '17px' }}>
              Áp dụng tại tất cả cửa hàng
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Không giới hạn địa điểm
            </p>
          </Box>
        </Box>

        <ItemRow items={vouchers} onItemClick={onItemClick} />
      </Box>
    </Box>
  );
};

// ─── Store list section ────────────────────────────────────────────────────────

const StoreListSection: FC<{ groups: StoreGroup[]; onItemClick: (v: Voucher) => void }> = ({ groups, onItemClick }) => {
  const navigate = useNavigate();

  if (groups.length === 0) return null;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <SectionHeader
        title="Danh mục cửa hàng"
        icon={<Store size={14} color="#fff" />}
      />

      {/* Store cards */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups.map((group) => (
          <StoreCard
            key={group.storeId}
            group={group}
            onItemClick={onItemClick}
            onCardClick={() => navigate(`/stores/${group.storeId}`, { state: { group } })}
          />
        ))}
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
  const navigate = useNavigate();
  const { globalVouchers, storeGroups, storeGroupsLoading, loadStoreGroups } = useVouchersStore();

  useEffect(() => {
    if (!storeGroupsLoading && storeGroups.length === 0 && globalVouchers.length === 0) {
      loadStoreGroups();
    }
  }, []);

  const handleItemClick = (r: Voucher) => navigate(`/rewards/${r.id}`);
  const isEmpty = !storeGroupsLoading && storeGroups.length === 0 && globalVouchers.length === 0;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8, paddingBottom: 16 }}>
      {storeGroupsLoading ? (
        <>
          <GlobalSkeleton />
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <StoreSkeleton />
            <StoreSkeleton />
            <StoreSkeleton />
          </Box>
        </>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <StoreListSection groups={storeGroups} onItemClick={handleItemClick} />
        </>
      )}
    </Box>
  );
};

export default StoreTab;
