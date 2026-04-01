import React, { FC, useEffect } from 'react';
import { Box } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Globe, Store, Navigation } from 'lucide-react';
import { useRewardsStore } from '@/store/vouchers';
import { Reward, StoreGroup } from '@/types/voucher';
import RewardItemCard from './item-card';
import { ACTIVE_THEME } from '@/constants/theme';

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

// ─── Skeletons ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="flex-shrink-0 animate-pulse"
    style={{ width: 160, borderRadius: 18, overflow: 'hidden', background: '#F3F4F6' }}
  >
    <Box style={{ height: 120, background: '#E9EBED' }} />
    <Box style={{ padding: '9px 10px 11px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ height: 9, width: '40%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '85%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 28, background: '#E9EBED', borderRadius: 9, marginTop: 2 }} />
    </Box>
  </Box>
);

const SectionSkeleton: FC = () => (
  <Box
    style={{
      margin: '0 12px', background: '#fff', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    }}
  >
    <Box style={{ height: 3, background: '#E9EBED' }} />
    <Box
      className="animate-pulse"
      style={{ padding: '13px 16px 11px', display: 'flex', alignItems: 'center', gap: 12 }}
    >
      <Box style={{ width: 44, height: 44, borderRadius: 13, background: '#E9EBED' }} />
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Box style={{ height: 13, width: '55%', background: '#E9EBED', borderRadius: 5 }} />
        <Box style={{ height: 10, width: '35%', background: '#E9EBED', borderRadius: 5 }} />
      </Box>
      <Box style={{ display: 'flex', gap: 5 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} style={{ width: 32, height: 32, borderRadius: 8, background: '#E9EBED' }} />
        ))}
      </Box>
    </Box>
    <Box flex style={{ gap: 10, padding: '4px 14px 16px' }}>
      {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
    </Box>
  </Box>
);

// ─── Item thumbnails ───────────────────────────────────────────────────────────

const ItemThumbnails: FC<{ items: Reward[] }> = ({ items }) => {
  const preview = items.slice(0, 3);
  return (
    <Box flex style={{ gap: 4 }}>
      {preview.map((item) => (
        <Box
          key={item.id}
          style={{
            width: 34, height: 34, borderRadius: 9,
            overflow: 'hidden', flexShrink: 0,
            border: '2px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <img
            src={item.thumbnailImageUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />
        </Box>
      ))}
    </Box>
  );
};

// ─── Item row ──────────────────────────────────────────────────────────────────

const ItemRow: FC<{ items: Reward[]; onItemClick: (r: Reward) => void }> = ({ items, onItemClick }) => (
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
      <RewardItemCard key={item.id} card={item} onClick={onItemClick} />
    ))}
  </Box>
);

// ─── Global rewards section ────────────────────────────────────────────────────

const GlobalSection: FC<{ rewards: Reward[]; onItemClick: (r: Reward) => void }> = ({ rewards, onItemClick }) => {
  if (rewards.length === 0) return null;

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
          <p style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{rewards.length} ưu đãi</p>
        </Box>
      </Box>

      {/* Cards */}
      <ItemRow items={rewards} onItemClick={onItemClick} />
    </Box>
  );
};

// ─── Store section ─────────────────────────────────────────────────────────────

const STORE_ACCENTS = [
  { bar: 'linear-gradient(90deg,#3B82F6,#93C5FD)', bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB', dot: '#3B82F6' },
  { bar: 'linear-gradient(90deg,#F97316,#FED7AA)', bg: '#FFF7ED', border: '#FED7AA', icon: '#C2410C', dot: '#F97316' },
  { bar: 'linear-gradient(90deg,#8B5CF6,#DDD6FE)', bg: '#F5F3FF', border: '#DDD6FE', icon: '#6D28D9', dot: '#8B5CF6' },
  { bar: 'linear-gradient(90deg,#F43F5E,#FECDD3)', bg: '#FFF1F2', border: '#FECDD3', icon: '#BE123C', dot: '#F43F5E' },
  { bar: 'linear-gradient(90deg,#14B8A6,#99F6E4)', bg: '#F0FDFA', border: '#99F6E4', icon: '#0F766E', dot: '#14B8A6' },
];

const StoreSection: FC<{ group: StoreGroup; index: number; onItemClick: (r: Reward) => void }> = ({ group, index, onItemClick }) => {
  const accent = STORE_ACCENTS[index % STORE_ACCENTS.length];

  const distanceLabel = group.distanceKm != null
    ? group.distanceKm < 1
      ? `${Math.round(group.distanceKm * 1000)} m`
      : `${group.distanceKm.toFixed(1)} km`
    : null;

  return (
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
      {/* Accent bar */}
      <Box style={{ height: 3, background: accent.bar }} />

      {/* Store header */}
      <Box
        flex
        className="items-center"
        style={{ gap: 11, padding: '13px 14px 11px', background: accent.bg }}
      >
        <Box
          style={{
            width: 44, height: 44, borderRadius: 13,
            background: '#fff',
            border: `1.5px solid ${accent.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 3px 10px ${accent.dot}28`,
          }}
        >
          <Store size={20} color={accent.icon} strokeWidth={1.8} />
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: '18px',
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            {group.storeName}
          </p>
          <Box flex className="items-center" style={{ gap: 5, marginTop: 3 }}>
            <Box
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: '#fff', border: `1px solid ${accent.border}`,
                borderRadius: 20, padding: '2px 8px',
              }}
            >
              <Box style={{ width: 5, height: 5, borderRadius: '50%', background: accent.dot }} />
              <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{group.items.length} mục</p>
            </Box>
            {distanceLabel && (
              <Box
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  background: '#fff', border: `1px solid ${accent.border}`,
                  borderRadius: 20, padding: '2px 8px',
                }}
              >
                <Navigation size={9} color={accent.icon} strokeWidth={2.5} />
                <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{distanceLabel}</p>
              </Box>
            )}
          </Box>
        </Box>

        {/* Item thumbnails */}
        <ItemThumbnails items={group.items} />
      </Box>

      {/* Items */}
      <ItemRow items={group.items} onItemClick={onItemClick} />
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
  const { globalRewards, storeGroups, storeGroupsLoading, loadStoreGroups } = useRewardsStore();

  useEffect(() => {
    if (storeGroups.length === 0 && globalRewards.length === 0) {
      loadStoreGroups();
    }
  }, []);

  const handleItemClick = (r: Reward) => navigate(`/rewards/${r.id}`);
  const isEmpty = !storeGroupsLoading && storeGroups.length === 0 && globalRewards.length === 0;

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
          <GlobalSection rewards={globalRewards} onItemClick={handleItemClick} />
          {storeGroups.map((group, i) => (
            <StoreSection key={group.storeId} group={group} index={i} onItemClick={handleItemClick} />
          ))}
        </>
      )}
    </Box>
  );
};

export default StoreTab;
