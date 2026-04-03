import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router';
import { Gift, ArrowUpDown, TrendingUp, TrendingDown, Tag, Ticket, ShoppingBag, UtensilsCrossed, Wrench, Store } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher } from '@/types/voucher';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import PageHeader from '@/components/ui/page-header';
import { ACTIVE_THEME } from '@/constants/theme';
import VoucherCard from './voucher-card';

// ─── Type helpers ──────────────────────────────────────────────────────────────

function getCategoryIcon(type: string, size = 22) {
  switch (type) {
    case 'Voucher':        return <Ticket size={size} color="#fff" strokeWidth={1.8} />;
    case 'PhysicalItem':   return <ShoppingBag size={size} color="#fff" strokeWidth={1.8} />;
    case 'FnbProduct':     return <UtensilsCrossed size={size} color="#fff" strokeWidth={1.8} />;
    case 'Service':        return <Wrench size={size} color="#fff" strokeWidth={1.8} />;
    case 'RetailProduct':  return <Store size={size} color="#fff" strokeWidth={1.8} />;
    default:               return <Tag size={size} color="#fff" strokeWidth={1.8} />;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <div className="animate-pulse" style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
    <div style={{ height: 122, background: '#E9EBED' }} />
    <div style={{ height: 26, background: '#EDEEF2' }} />
    <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ height: 9, width: '40%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 26, width: '55%', background: '#E9EBED', borderRadius: 8, marginTop: 2 }} />
    </div>
  </div>
);

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortOrder = 'default' | 'asc' | 'desc';

const SORT_OPTIONS: { key: SortOrder; label: string; icon: React.ReactNode }[] = [
  { key: 'default', label: 'Mặc định',    icon: <ArrowUpDown size={12} strokeWidth={2.2} /> },
  { key: 'asc',     label: 'Ít nhất',     icon: <TrendingDown size={12} strokeWidth={2.2} /> },
  { key: 'desc',    label: 'Nhiều nhất',  icon: <TrendingUp size={12} strokeWidth={2.2} /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const CategoryDetailPage: FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { getGroupedByCategory, loadAllVouchers, allVouchers, loading } = useVouchersStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const decodedCategory = decodeURIComponent(category || '');

  // Detect item type from the category string
  const itemType = allVouchers.find((r) => r.category === decodedCategory)?.type ?? '';

  useEffect(() => {
    if (!allVouchers.length) {
      loadAllVouchers().catch(() => {
        openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
      });
    }
  }, []);

  const grouped = getGroupedByCategory();
  const rawCards: Voucher[] = grouped[decodedCategory] || [];

  const cards = useMemo(() => {
    if (sortOrder === 'asc')  return [...rawCards].sort((a, b) => a.pointsRequired - b.pointsRequired);
    if (sortOrder === 'desc') return [...rawCards].sort((a, b) => b.pointsRequired - a.pointsRequired);
    return rawCards;
  }, [rawCards, sortOrder]);

  const isLoading = loading && rawCards.length === 0;

  const handleRefresh = async () => {
    await loadAllVouchers().catch(() => {
      openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
    });
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ background: ACTIVE_THEME.pageBg }}>

      {/* ── Banner ── */}
      <PageHeader paddingBottom={8}>
        <Box flex className="items-center" style={{ gap: 14 }}>
          <Box
            style={{
              width: 54, height: 54, borderRadius: 16,
              background: 'rgba(255,255,255,0.16)',
              border: '1.5px solid rgba(255,255,255,0.26)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            }}
          >
            {getCategoryIcon(itemType, 24)}
          </Box>

          <Box style={{ flex: 1 }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: '26px', textShadow: '0 1px 6px rgba(0,0,0,0.22)' }}>
              {decodedCategory}
            </p>
            {!isLoading && (
              <Box flex className="items-center" style={{ gap: 7, marginTop: 7 }}>
                <Box style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 100, padding: '3px 11px' }}>
                  <p style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{cards.length} mục</p>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </PageHeader>

      {/* ── Sort bar ── */}
      <Box
        flex
        className="items-center bg-white"
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #F0F0F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          flexShrink: 0,
          gap: 10,
        }}
      >
        {/* Sort pills */}
        <Box flex style={{ gap: 6 }}>
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortOrder === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSortOrder(opt.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 10px',
                  background: isActive ? '#DCFCE7' : '#F3F4F6',
                  border: `1.5px solid ${isActive ? '#86EFAC' : 'transparent'}`,
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: isActive ? '#166534' : '#6B7280',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                {opt.icon}
                <p style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>
                  {opt.label}
                </p>
              </button>
            );
          })}
        </Box>
      </Box>

      {/* ── Grid ── */}
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            padding: '14px 12px 24px',
            alignContent: 'start',
          }}
        >
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)
          ) : cards.length === 0 ? (
            <Box
              className="col-span-2 flex flex-col items-center justify-center"
              style={{ paddingTop: 72, gap: 14 }}
            >
              <Box
                style={{
                  width: 84, height: 84, borderRadius: '50%',
                  background: 'linear-gradient(145deg, #DCFCE7, #BBF7D0)',
                  boxShadow: '0 6px 20px rgba(40,143,78,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Gift size={36} color="#288F4E" />
              </Box>
              <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#374151' }}>Chưa có voucher</p>
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>Danh mục này chưa có voucher nào</p>
              </Box>
            </Box>
          ) : (
            cards.map((card) => (
              <VoucherCard key={card.id} card={card} onClick={(c) => navigate(`/rewards/${c.id}`)} />
            ))
          )}
        </div>
      </PullToRefresh>

    </Page>
  );
};

export default CategoryDetailPage;
