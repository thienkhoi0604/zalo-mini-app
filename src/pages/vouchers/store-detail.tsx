import React, { FC, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box } from 'zmp-ui';
import { MapPin, Clock, Phone, Navigation, Tag, PackageOpen, Store, ExternalLink } from 'lucide-react';
import { StoreGroup, Voucher, FEED_ITEM_TYPES } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import { formatDate } from '@/utils/date';
import { COLORS } from '@/constants';
import { getStoreById, AppStore } from '@/api/stores';
import { getFeedItems } from '@/api/feed';
import { openWebview } from 'zmp-sdk';
import defaultStoreImg from '@/assets/images/logo.png';

const VOUCHER_FALLBACK = defaultStoreImg;

// ─── Info row ──────────────────────────────────────────────────────────────────

const InfoRow: FC<{ icon: React.ReactNode; label: string; value: string; onPress?: () => void }> = ({ icon, label, value, onPress }) => (
  <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }} onClick={onPress}>
    <Box
      style={{
        width: 36,
        height: 36,
        borderRadius: 11,
        background: COLORS.primaryLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, letterSpacing: 0.4, marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 13.5, color: onPress ? COLORS.primary : '#374151', fontWeight: 500, lineHeight: '19px' }}>
        {value}
      </p>
    </Box>
  </Box>
);

// ─── Voucher row ───────────────────────────────────────────────────────────────

function getTypeColor(type: string): { bg: string; text: string } {
  switch (type) {
    case FEED_ITEM_TYPES.FNB_PRODUCT:    return { bg: '#FEF3C7', text: '#92400E' };
    case FEED_ITEM_TYPES.PHYSICAL_ITEM:  return { bg: '#EDE9FE', text: '#5B21B6' };
    case FEED_ITEM_TYPES.SERVICE:        return { bg: '#DBEAFE', text: '#1E40AF' };
    case FEED_ITEM_TYPES.RETAIL_PRODUCT: return { bg: '#FCE7F3', text: '#9D174D' };
    default:                             return { bg: COLORS.primaryLight, text: COLORS.primaryDark };
  }
}

const VoucherRow: FC<{ voucher: Voucher; onClick: () => void }> = ({ voucher, onClick }) => {
  const expired = voucher.status === 'expired';
  const typeColor = getTypeColor(voucher.type);

  return (
    <Box
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 16px',
        cursor: 'pointer',
        opacity: expired ? 0.6 : 1,
      }}
    >
      {/* Thumbnail */}
      <Box
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          overflow: 'hidden',
          flexShrink: 0,
          background: '#F0EBE3',
          position: 'relative',
        }}
      >
        <img
          src={voucher.thumbnailImageUrl}
          alt={voucher.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).src = VOUCHER_FALLBACK; }}
        />
        {expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.48)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <p style={{ fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>HẾT HẠN</p>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: expired ? '#9CA3AF' : '#111827',
            lineHeight: '19px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {voucher.name}
        </p>

        <Box style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box style={{ background: typeColor.bg, borderRadius: 5, padding: '2px 7px' }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: typeColor.text }}>
              {voucher.category}
            </p>
          </Box>
          {!expired && voucher.stock != null && voucher.stock <= 20 && (
            <p style={{ fontSize: 10.5, color: '#EF4444', fontWeight: 600 }}>
              Còn {voucher.stock}
            </p>
          )}
        </Box>

        {!expired && voucher.applicableTimeEnd && (
          <p style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 'auto' }}>
            HSD: {formatDate(voucher.applicableTimeEnd)}
          </p>
        )}
      </Box>

      {/* Cost */}
      <Box style={{ flexShrink: 0 }}>
        {expired ? (
          <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Hết hạn</p>
        ) : (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '4px 9px',
            }}
          >
            <CoinIcon size={13} />
            <p style={{ fontSize: 12.5, fontWeight: 800, color: '#B45309' }}>
              {voucher.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton: FC = () => (
  <Box className="animate-pulse">
    <Box style={{ height: 240, background: '#E9EBED' }} />
    <Box style={{ padding: '16px 16px 12px' }}>
      <Box style={{ height: 26, width: '55%', background: '#E9EBED', borderRadius: 8, marginBottom: 10 }} />
      <Box style={{ height: 18, width: '35%', background: '#E9EBED', borderRadius: 20 }} />
    </Box>
    <Box style={{ margin: '0 16px', borderRadius: 18, background: '#fff', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1, 2].map((i) => (
        <Box key={i} style={{ display: 'flex', gap: 12 }}>
          <Box style={{ width: 36, height: 36, borderRadius: 11, background: '#E9EBED', flexShrink: 0 }} />
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box style={{ height: 10, width: '30%', background: '#E9EBED', borderRadius: 4 }} />
            <Box style={{ height: 14, width: '80%', background: '#E9EBED', borderRadius: 4 }} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Empty vouchers ────────────────────────────────────────────────────────────

const EmptyVouchers: FC = () => (
  <Box
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px',
      gap: 14,
    }}
  >
    <Box
      style={{
        width: 80, height: 80, borderRadius: '50%',
        background: COLORS.primaryLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Tag size={34} color={COLORS.primary} strokeWidth={1.5} />
    </Box>
    <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Chưa có ưu đãi</p>
      <p style={{ fontSize: 13, color: '#9CA3AF' }}>Cửa hàng này chưa có voucher nào</p>
    </Box>
  </Box>
);

// ─── Voucher section ───────────────────────────────────────────────────────────

const VoucherSection: FC<{ title: string; items: Voucher[]; onItemClick: (v: Voucher) => void }> = ({ title, items, onItemClick }) => {
  const activeCount = items.filter((v) => v.status !== 'expired').length;
  return (
    <Box style={{ margin: '0 16px' }}>
      <Box style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Box style={{ width: 4, height: 18, borderRadius: 2, background: COLORS.primary, flexShrink: 0 }} />
        <p style={{ fontSize: 15, fontWeight: 800, color: '#111827', flex: 1 }}>{title}</p>
        <Box style={{ background: COLORS.primaryLight, borderRadius: 20, padding: '3px 10px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary }}>{activeCount} ưu đãi</p>
        </Box>
      </Box>
      <Box
        style={{
          background: '#fff',
          borderRadius: 18,
          border: '1px solid #F0F1F3',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        {items.map((voucher, idx) => (
          <Box key={voucher.id}>
            {idx > 0 && <Box style={{ height: 1, background: '#F3F4F6', margin: '0 16px' }} />}
            <VoucherRow voucher={voucher} onClick={() => onItemClick(voucher)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Not found ─────────────────────────────────────────────────────────────────

const NotFound: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        gap: 16,
      }}
    >
      <Store size={48} color="#D1D5DB" strokeWidth={1.2} />
      <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>Không tìm thấy cửa hàng</p>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>Vui lòng quay lại và thử lại</p>
      </Box>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 4,
          background: COLORS.primary,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Quay lại
      </button>
    </Box>
  );
};

// ─── Store Detail Page ─────────────────────────────────────────────────────────

const StoreDetailPage: FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { state } = useLocation() as { state?: { group?: StoreGroup } };

  const [store, setStore] = useState<AppStore | null>(null);
  const [storeVouchers, setStoreVouchers] = useState<Voucher[]>(state?.group?.items ?? []);
  const [loading, setLoading] = useState(true);

  const group = state?.group ?? null;

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const [result, vouchers] = await Promise.all([
      getStoreById(storeId),
      getFeedItems({ pageNumber: 1, pageSize: 100, storeId }),
    ]);
    setStore(result);
    setStoreVouchers(vouchers.length > 0 ? vouchers : (state?.group?.items ?? []));
    setLoading(false);
  }, [storeId]);

  useEffect(() => { load(); }, [load]);

  if (!loading && !store && !group) return <NotFound />;

  // Merge: API data takes priority for store info; voucher items come from navigation state
  const name        = store?.name        ?? group?.storeName  ?? '';
  const address     = store?.address     ?? group?.address    ?? null;
  const phone       = store?.phone       ?? group?.phone      ?? null;
  const imageUrl    = store?.imageUrl    ?? group?.imageUrl   ?? null;
  const description = store?.description ?? null;
  const openFrom    = store?.openTime    ?? group?.openFrom   ?? null;
  const openTo      = store?.closeTime   ?? group?.openTo     ?? null;
  const distanceKm  = store?.distanceKm  ?? group?.distanceKm ?? null;
  const mapsUrl     = store?.googleMapsDirectionUrl ?? null;
  const workingStatus = group?.workingStatus ?? null;
  const items       = storeVouchers;

  const distanceLabel = distanceKm != null
    ? distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`
    : null;

  const hoursLabel = openFrom && openTo ? `${openFrom} – ${openTo}` : null;
  const giftItems    = items.filter((v) => [FEED_ITEM_TYPES.VOUCHER, FEED_ITEM_TYPES.PHYSICAL_ITEM].includes(v.type as any));
  const productItems = items.filter((v) => [FEED_ITEM_TYPES.FNB_PRODUCT, FEED_ITEM_TYPES.SERVICE, FEED_ITEM_TYPES.RETAIL_PRODUCT].includes(v.type as any));
  const activeCount = items.filter((v) => v.status !== 'expired').length;

  const handleVoucherClick = (v: Voucher) => navigate(`/rewards/${v.id}`);
  const handleMapsOpen = () => {
    if (mapsUrl) openWebview({ url: mapsUrl });
  };

  return (
    <PullToRefresh onRefresh={load} className="flex-1">
      <Box style={{ flex: 1, background: '#F8F9FA' }}>

        {loading ? <Skeleton /> : (
          <>
            {/* ── Hero ── */}
            <Box style={{ position: 'relative', height: 240, background: '#E5E7EB', flexShrink: 0 }}>
              <img
                src={imageUrl ?? defaultStoreImg}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).src = defaultStoreImg; }}
              />
              <Box
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
                  background: 'linear-gradient(to bottom, transparent, #F8F9FA)',
                }}
              />
            </Box>

            {/* ── Store identity ── */}
            <Box style={{ padding: '4px 16px 16px', background: '#F8F9FA' }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: '29px', marginBottom: 8 }}>
                {name}
              </p>
              {description && (
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: '19px', marginBottom: 8 }}>
                  {description}
                </p>
              )}

              <Box style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {workingStatus && (
                  <Box
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: workingStatus === 'Open' ? '#DCFCE7' : '#FEE2E2',
                      border: `1px solid ${workingStatus === 'Open' ? '#BBF7D0' : '#FECACA'}`,
                      borderRadius: 20, padding: '4px 11px',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: workingStatus === 'Open' ? '#16A34A' : '#DC2626' }} />
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: workingStatus === 'Open' ? '#166534' : '#991B1B' }}>
                      {workingStatus === 'Open' ? 'Đang mở cửa' : 'Đóng cửa'}
                    </p>
                  </Box>
                )}
                {distanceLabel && (
                  <Box
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: COLORS.primaryLight, border: '1px solid #BBF7D0',
                      borderRadius: 20, padding: '4px 11px',
                    }}
                  >
                    <Navigation size={11} color={COLORS.primary} strokeWidth={2.5} />
                    <p style={{ fontSize: 11.5, color: COLORS.primary, fontWeight: 700 }}>{distanceLabel}</p>
                  </Box>
                )}
                {items.length > 0 && (
                  <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F3F4F6', borderRadius: 20, padding: '4px 11px' }}>
                    <Tag size={11} color="#6B7280" />
                    <p style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 600 }}>
                      {activeCount > 0 ? `${activeCount} ưu đãi` : 'Không có ưu đãi'}
                    </p>
                  </Box>
                )}
              </Box>
            </Box>

            {/* ── Info card ── */}
            {(address || hoursLabel || phone || mapsUrl) && (
              <Box
                style={{
                  margin: '0 16px',
                  background: '#fff',
                  borderRadius: 18,
                  border: '1px solid #F0F1F3',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                {address && (
                  <InfoRow icon={<MapPin size={16} color={COLORS.primary} />} label="ĐỊA CHỈ" value={address} />
                )}
                {address && (hoursLabel || phone || mapsUrl) && <Box style={{ height: 1, background: '#F3F4F6' }} />}
                {hoursLabel && (
                  <InfoRow icon={<Clock size={16} color={COLORS.primary} />} label="GIỜ MỞ CỬA" value={hoursLabel} />
                )}
                {hoursLabel && (phone || mapsUrl) && <Box style={{ height: 1, background: '#F3F4F6' }} />}
                {phone && (
                  <InfoRow icon={<Phone size={16} color={COLORS.primary} />} label="ĐIỆN THOẠI" value={phone} />
                )}
                {phone && mapsUrl && <Box style={{ height: 1, background: '#F3F4F6' }} />}
                {mapsUrl && (
                  <InfoRow
                    icon={<ExternalLink size={16} color={COLORS.primary} />}
                    label="CHỈ ĐƯỜNG"
                    value="Xem trên Google Maps"
                    onPress={handleMapsOpen}
                  />
                )}
              </Box>
            )}
          </>
        )}

        {/* ── Voucher sections ── */}
        <Box style={{ marginTop: 24, paddingBottom: 'calc(24px + var(--zaui-safe-area-inset-bottom, 0px))', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {items.length === 0 && <EmptyVouchers />}

          {/* Sản phẩm / Dịch vụ */}
          {productItems.length > 0 && (
            <VoucherSection
              title="Sản phẩm / Dịch vụ"
              items={productItems}
              onItemClick={handleVoucherClick}
            />
          )}

          {/* Quà tặng */}
          {giftItems.length > 0 && (
            <VoucherSection
              title="Quà tặng"
              items={giftItems}
              onItemClick={handleVoucherClick}
            />
          )}

          {items.length > 0 && (
            <Box style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', justifyContent: 'center' }}>
              <PackageOpen size={13} color="#9CA3AF" />
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>
                {items.length} ưu đãi · {activeCount} còn hiệu lực
              </p>
            </Box>
          )}
        </Box>

      </Box>
    </PullToRefresh>
  );
};

export default StoreDetailPage;
