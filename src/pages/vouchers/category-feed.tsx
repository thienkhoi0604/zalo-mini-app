import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router';
import { Gift, ArrowUpDown, TrendingUp, TrendingDown, Tag, CheckCircle, Ticket, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useRewardsStore } from '@/store/vouchers';
import { Reward, getRewardTypeLabel } from '@/types/voucher';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import PageHeader from '@/components/ui/page-header';
import { ACTIVE_THEME } from '@/constants/theme';

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

// ─── Type helpers ──────────────────────────────────────────────────────────────

function getCategoryIcon(type: string, size = 22) {
  switch (type) {
    case 'Voucher':      return <Ticket size={size} color="#fff" strokeWidth={1.8} />;
    case 'PhysicalItem': return <ShoppingBag size={size} color="#fff" strokeWidth={1.8} />;
    case 'FnbProduct':   return <UtensilsCrossed size={size} color="#fff" strokeWidth={1.8} />;
    default:             return <Tag size={size} color="#fff" strokeWidth={1.8} />;
  }
}

function getTypeChipStyle(type: string) {
  switch (type) {
    case 'Voucher':      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    case 'PhysicalItem': return { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' };
    case 'FnbProduct':   return { bg: '#CFFAFE', text: '#0E7490', border: '#A5F3FC' };
    default:             return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box className="animate-pulse" style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
    <Box style={{ height: 144, background: '#E9EBED' }} />
    <Box style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Box style={{ height: 9, width: '35%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 30, background: '#E9EBED', borderRadius: 9, marginTop: 3 }} />
    </Box>
  </Box>
);

// ─── Reward Card (grid) ────────────────────────────────────────────────────────

const RewardCard: FC<{ card: Reward; onClick: (card: Reward) => void }> = ({ card, onClick }) => {
  const expired = card.status === 'expired';
  const chip = getTypeChipStyle(card.type);
  const lowStock = card.stock != null && card.stock > 0 && card.stock <= 10;

  return (
    <Box
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: expired ? '0 1px 8px rgba(0,0,0,0.05)' : '0 6px 20px rgba(0,0,0,0.1)',
        opacity: expired ? 0.65 : 1,
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Image */}
      <Box style={{ height: 144, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Gradient scrim */}
        {!expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Expired overlay */}
        {expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.42)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box style={{ background: '#EF4444', borderRadius: 20, padding: '4px 14px', boxShadow: '0 2px 10px rgba(239,68,68,0.5)' }}>
              <p style={{ fontSize: 10, color: '#fff', fontWeight: 800, letterSpacing: 0.8 }}>HẾT HẠN</p>
            </Box>
          </Box>
        )}

        {/* Points badge */}
        {!expired && (
          <Box
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 100, padding: '3px 8px',
              display: 'flex', alignItems: 'center', gap: 3,
              boxShadow: '0 2px 8px rgba(217,119,6,0.5)',
            }}
          >
            <span style={{ fontSize: 9 }}>🪙</span>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </Box>
        )}

        {/* Low stock */}
        {!expired && lowStock && (
          <Box
            style={{
              position: 'absolute', bottom: 8, right: 8,
              background: 'rgba(239,68,68,0.92)',
              borderRadius: 6, padding: '2px 7px',
            }}
          >
            <p style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>Còn {card.stock}</p>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box style={{ padding: '10px 11px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Type chip */}
        <Box
          style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: chip.bg, border: `1px solid ${chip.border}`,
            borderRadius: 6, padding: '2px 7px',
          }}
        >
          <p style={{ fontSize: 9, color: chip.text, fontWeight: 700, letterSpacing: 0.3 }}>
            {getRewardTypeLabel(card.type)}
          </p>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 12, fontWeight: 700, lineHeight: '17px',
            color: expired ? '#9CA3AF' : '#111827',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: 34,
          }}
        >
          {card.name}
        </p>

        {/* Cost strip */}
        {expired ? (
          <Box
            style={{
              borderRadius: 9, padding: '6px 9px',
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <CheckCircle size={12} color="#9CA3AF" />
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>Đã hết hạn</p>
          </Box>
        ) : (
          <Box
            style={{
              borderRadius: 9, padding: '6px 9px',
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1px solid #FDE68A',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ fontSize: 13 }}>🪙</span>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#B45309' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
            <p style={{ fontSize: 10, color: '#D97706', fontWeight: 600 }}>{card.costCurrency}</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

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
  const { getGroupedByCategory, loadAllRewards, allRewards, loading } = useRewardsStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const decodedCategory = decodeURIComponent(category || '');

  // Detect item type from the category string
  const itemType = allRewards.find((r) => r.category === decodedCategory)?.type ?? '';

  useEffect(() => {
    if (!allRewards.length) {
      loadAllRewards().catch(() => {
        openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
      });
    }
  }, []);

  const grouped = getGroupedByCategory();
  const rawCards: Reward[] = grouped[decodedCategory] || [];

  const cards = useMemo(() => {
    if (sortOrder === 'asc')  return [...rawCards].sort((a, b) => a.pointsRequired - b.pointsRequired);
    if (sortOrder === 'desc') return [...rawCards].sort((a, b) => b.pointsRequired - a.pointsRequired);
    return rawCards;
  }, [rawCards, sortOrder]);

  const isLoading = loading && rawCards.length === 0;
  const activeCount = cards.filter((c) => c.status === 'active').length;

  const handleRefresh = async () => {
    await loadAllRewards().catch(() => {
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
                {activeCount > 0 && (
                  <Box style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 100, padding: '3px 11px' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{activeCount} khả dụng</p>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </PageHeader>

      {/* ── Sort bar ── */}
      <Box
        flex
        className="items-center justify-between bg-white"
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #F0F0F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          flexShrink: 0,
          gap: 10,
        }}
      >
        {/* Availability indicator */}
        <Box flex className="items-center" style={{ gap: 5 }}>
          <Box
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: activeCount > 0 ? '#22C55E' : '#D1D5DB',
              boxShadow: activeCount > 0 ? '0 0 0 3px rgba(34,197,94,0.18)' : 'none',
            }}
          />
          <p style={{ fontSize: 12, color: activeCount > 0 ? '#15803D' : '#9CA3AF', fontWeight: 600 }}>
            {isLoading ? '—' : `${activeCount} khả dụng`}
          </p>
        </Box>

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
              <RewardCard key={card.id} card={card} onClick={(c) => navigate(`/rewards/${c.id}`)} />
            ))
          )}
        </div>
      </PullToRefresh>

    </Page>
  );
};

export default CategoryDetailPage;
