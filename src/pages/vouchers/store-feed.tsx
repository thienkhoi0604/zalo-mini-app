import React, { FC, useEffect } from 'react';
import { Box } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Globe, Store, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher, StoreGroup } from '@/types/voucher';
import VoucherItemCard from './item-card';
import { ACTIVE_THEME } from '@/constants/theme';
import defaultStoreImg from '@/assets/images/logo.png';

// ─── Skeletons ─────────────────────────────────────────────────────────────────


const SectionSkeleton: FC = () => (
  <Box
    className="animate-pulse"
    style={{
      margin: '0 12px', background: '#fff', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    }}
  >
    <Box style={{ display: 'flex', gap: 0 }}>
      <Box style={{ width: 120, height: 110, background: '#E9EBED', flexShrink: 0 }} />
      <Box style={{ flex: 1, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box style={{ height: 14, width: '70%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '60%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '50%', background: '#E9EBED', borderRadius: 5 }} />
      </Box>
    </Box>
  </Box>
);

// ─── Item row ──────────────────────────────────────────────────────────────────

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

// ─── Store Card ────────────────────────────────────────────────────────────────

const StoreCard: FC<{ group: StoreGroup }> = ({ group }) => {
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
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Left: store image */}
      <Box style={{ width: 120, flexShrink: 0, position: 'relative', background: '#F3F4F6' }}>
        <img
          src={group.imageUrl ?? defaultStoreImg}
          alt={group.storeName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).src = defaultStoreImg; }}
        />
      </Box>

      {/* Right: info */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: '12px 14px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          justifyContent: 'center',
        }}
      >
        {/* Store name */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#111827',
            lineHeight: '20px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {group.storeName}
        </p>

        {/* Address */}
        {group.address && (
          <Box flex className="items-start" style={{ gap: 5 }}>
            <MapPin size={11} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
            <p
              style={{
                fontSize: 11,
                color: '#6B7280',
                lineHeight: '16px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {group.address}
            </p>
          </Box>
        )}

        {/* Opening hours */}
        {hoursLabel && (
          <Box flex className="items-center" style={{ gap: 5 }}>
            <Clock size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: '#6B7280', lineHeight: '16px' }}>{hoursLabel}</p>
          </Box>
        )}

        {/* Phone */}
        {group.phone && (
          <Box flex className="items-center" style={{ gap: 5 }}>
            <Phone size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: '#6B7280', lineHeight: '16px' }}>{group.phone}</p>
          </Box>
        )}

        {/* Distance badge */}
        {distanceLabel && (
          <Box flex className="items-center" style={{ gap: 5, marginTop: 2 }}>
            <Box
              flex
              className="items-center"
              style={{
                gap: 4,
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 20,
                padding: '2px 8px',
                alignSelf: 'flex-start',
              }}
            >
              <Navigation size={9} color="#288F4E" strokeWidth={2.5} />
              <p style={{ fontSize: 10, color: '#288F4E', fontWeight: 700 }}>{distanceLabel}</p>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Store section (card + items) ──────────────────────────────────────────────

const StoreSection: FC<{ group: StoreGroup }> = ({ group }) => (
  <Box
    style={{
      margin: '0 12px',
      background: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.04)',
    }}
  >
    <StoreCard group={group} />
  </Box>
);

// ─── Global rewards section ────────────────────────────────────────────────────

const GlobalSection: FC<{ vouchers: Voucher[]; onItemClick: (r: Voucher) => void }> = ({ vouchers, onItemClick }) => {
  if (vouchers.length === 0) return null;

  const t = ACTIVE_THEME;
  const gradient = `linear-gradient(135deg, ${t.headerFrom} 0%, ${t.headerMid} 55%, ${t.headerTo} 100%)`;
  const blob = `rgba(255,255,255,${t.blobOpacity})`;

  return (
    <Box
      style={{
        margin: '0 12px',
        borderRadius: 20,
        overflow: 'hidden',
        background: gradient,
        boxShadow: `0 6px 24px rgba(0,0,0,0.22)`,
        position: 'relative',
      }}
    >
      {/* Decorative blobs */}
      <Box style={{ position: 'absolute', top: -24, right: -24, width: 110, height: 110, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', bottom: -28, left: 16, width: 80, height: 80, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', top: 14, right: 80, width: 44, height: 44, borderRadius: '50%', background: blob, pointerEvents: 'none' }} />

      {/* Header */}
      <Box
        flex
        className="items-center justify-between"
        style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.12)', position: 'relative' }}
      >
        <Box flex className="items-center" style={{ gap: 11 }}>
          <Box
            style={{
              width: 44, height: 44, borderRadius: 13,
              background: 'rgba(255,255,255,0.16)',
              border: '1.5px solid rgba(255,255,255,0.24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            }}
          >
            <Globe size={20} color="#fff" strokeWidth={1.8} />
          </Box>
          <Box>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: '18px' }}>
              Ưu đãi toàn hệ thống
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Áp dụng tại tất cả cửa hàng
            </p>
          </Box>
        </Box>
        <Box
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: 20, padding: '4px 10px',
          }}
        >
          <p style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{vouchers.length} ưu đãi</p>
        </Box>
      </Box>

      <ItemRow items={vouchers} onItemClick={onItemClick} />
    </Box>
  );
};

// ─── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: FC = () => (
  <Box className="flex flex-col items-center justify-center py-24" style={{ gap: 14 }}>
    <Box
      style={{
        width: 84, height: 84, borderRadius: '50%',
        background: 'linear-gradient(145deg, #EFF6FF, #DBEAFE)',
        boxShadow: '0 6px 20px rgba(37,99,235,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Store size={36} color="#2563EB" />
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
    if (storeGroups.length === 0 && globalVouchers.length === 0) {
      loadStoreGroups();
    }
  }, []);

  const handleItemClick = (r: Voucher) => navigate(`/rewards/${r.id}`);
  const isEmpty = !storeGroupsLoading && storeGroups.length === 0 && globalVouchers.length === 0;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6, paddingBottom: 12 }}>
      {storeGroupsLoading ? (
        <>
          <SectionSkeleton />
          <SectionSkeleton />
        </>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <GlobalSection vouchers={globalVouchers} onItemClick={handleItemClick} />
          {storeGroups.map((group) => (
            <StoreSection key={group.storeId} group={group} />
          ))}
        </>
      )}
    </Box>
  );
};

export default StoreTab;
