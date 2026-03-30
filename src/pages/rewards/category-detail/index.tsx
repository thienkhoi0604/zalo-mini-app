import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router';
import { Gift, ArrowUpDown, TrendingUp, TrendingDown, Tag, CheckCircle, SlidersHorizontal, X } from 'lucide-react';
import { useRewardsStore } from '@/store/rewards';
import { Reward, getRewardTypeLabel } from '@/types/reward';
import PullToRefresh from '@/components/ui/pull-to-refresh';

const FALLBACK = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box className="animate-pulse" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
    <Box style={{ height: 130, background: '#E9EBED' }} />
    <Box style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Box style={{ height: 9, width: '40%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 30, background: '#E9EBED', borderRadius: 8, marginTop: 3 }} />
    </Box>
  </Box>
);

// ─── Reward Card ──────────────────────────────────────────────────────────────

const RewardCard: FC<{ card: Reward; onClick: (card: Reward) => void }> = ({ card, onClick }) => {
  const expired = card.status === 'expired';

  return (
    <Box
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: expired ? '0 1px 6px rgba(0,0,0,0.05)' : '0 4px 16px rgba(0,0,0,0.09)',
        opacity: expired ? 0.65 : 1,
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Image */}
      <Box style={{ height: 130, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Bottom scrim */}
        {!expired && (
          <Box
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 54,
              background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Expired overlay */}
        {expired && (
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box style={{ background: '#EF4444', borderRadius: 20, padding: '4px 14px', boxShadow: '0 2px 10px rgba(239,68,68,0.45)' }}>
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
              borderRadius: 100,
              padding: '3px 8px',
              display: 'flex', alignItems: 'center', gap: 3,
              boxShadow: '0 2px 8px rgba(217,119,6,0.45)',
            }}
          >
            <span style={{ fontSize: 9 }}>🪙</span>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box style={{ padding: '10px 11px 11px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Brand */}
        <Box flex className="items-center" style={{ gap: 5 }}>
          {card.brandLogoUrl ? (
            <img
              src={card.brandLogoUrl} alt={card.brandName}
              style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <Box style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)', flexShrink: 0 }} />
          )}
          <p
            style={{
              fontSize: 9, color: '#B0B7C3', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            {card.brandName || getRewardTypeLabel(card.type)}
          </p>
        </Box>

        {/* Name */}
        <p
          style={{
            fontSize: 12, color: expired ? '#9CA3AF' : '#111827', fontWeight: 700,
            lineHeight: '17px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: 34,
          }}
        >
          {card.name}
        </p>

        {/* Bottom strip */}
        <Box
          style={{
            marginTop: 2,
            background: expired ? '#F9FAFB' : 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: `1px solid ${expired ? '#E5E7EB' : '#FDE68A'}`,
            borderRadius: 9,
            padding: '6px 9px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          {expired ? (
            <>
              <CheckCircle size={12} color="#9CA3AF" />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>Đã hết hạn</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13 }}>🪙</span>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#B45309' }}>
                {card.pointsRequired.toLocaleString('vi-VN')}
              </p>
              <p style={{ fontSize: 10, color: '#D97706', fontWeight: 500 }}>xu</p>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortOrder = 'asc' | 'desc' | 'default';

const SORT_OPTIONS: { key: SortOrder; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'default', label: 'Mặc định',    icon: <ArrowUpDown size={13} />,  color: '#6B7280' },
  { key: 'asc',     label: 'Ít xu nhất',  icon: <TrendingDown size={13} />, color: '#288F4E' },
  { key: 'desc',    label: 'Nhiều xu nhất', icon: <TrendingUp size={13} />, color: '#D97706' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const CategoryDetailPage: FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { getGroupedByCategory, loadAllRewards, allRewards, loading } = useRewardsStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const decodedCategory = decodeURIComponent(category || '');

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
    if (sortOrder === 'asc') return [...rawCards].sort((a, b) => a.pointsRequired - b.pointsRequired);
    if (sortOrder === 'desc') return [...rawCards].sort((a, b) => b.pointsRequired - a.pointsRequired);
    return rawCards;
  }, [rawCards, sortOrder]);

  const isLoading = loading && rawCards.length === 0;
  const activeCount = cards.filter((c) => c.status === 'active').length;
  const currentSort = SORT_OPTIONS.find((o) => o.key === sortOrder)!;

  const handleRefresh = async () => {
    await loadAllRewards().catch(() => {
      openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
    });
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F4F5F7' }}>

      {/* ── Banner ── */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #134E2A 0%, #1e7a42 50%, #288F4E 100%)',
          padding: '16px 16px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box style={{ position: 'absolute', top: -28, right: -18, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', bottom: -24, left: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <Box style={{ position: 'absolute', top: 10, right: 90, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <Box flex className="items-center" style={{ gap: 14 }}>
          <Box
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <Tag size={24} color="#fff" strokeWidth={1.8} />
          </Box>

          <Box style={{ flex: 1 }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: '26px', textShadow: '0 1px 6px rgba(0,0,0,0.2)' }}>
              {decodedCategory}
            </p>
            {!isLoading && (
              <Box flex className="items-center" style={{ gap: 7, marginTop: 6 }}>
                <Box
                  style={{
                    background: 'rgba(255,255,255,0.16)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 100, padding: '3px 10px',
                  }}
                >
                  <p style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{cards.length} phần thưởng</p>
                </Box>
                {activeCount > 0 && (
                  <Box
                    style={{
                      background: 'rgba(52,210,104,0.25)',
                      border: '1px solid rgba(52,210,104,0.35)',
                      borderRadius: 100, padding: '3px 10px',
                    }}
                  >
                    <p style={{ fontSize: 11, color: '#A7F3D0', fontWeight: 600 }}>{activeCount} khả dụng</p>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Sort Bar ── */}
      <Box
        flex
        className="items-center justify-between bg-white"
        style={{
          padding: '0 14px',
          height: 48,
          borderBottom: '1px solid #EFEFEF',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box flex className="items-center" style={{ gap: 6 }}>
          <Box style={{ width: 6, height: 6, borderRadius: '50%', background: activeCount > 0 ? '#34D268' : '#D1D5DB' }} />
          <p style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
            {isLoading ? '—' : `${activeCount} khả dụng`}
          </p>
        </Box>

        {/* Sort trigger */}
        <button
          onClick={() => setShowSortMenu((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: showSortMenu ? '#F0FDF4' : '#F9FAFB',
            border: `1.5px solid ${showSortMenu ? '#86EFAC' : '#E5E7EB'}`,
            borderRadius: 20,
            padding: '5px 10px 5px 8px',
            cursor: 'pointer',
          }}
        >
          <Box
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: showSortMenu ? '#DCFCE7' : '#F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <SlidersHorizontal size={11} color={showSortMenu ? '#288F4E' : '#6B7280'} strokeWidth={2} />
          </Box>
          <p style={{ fontSize: 12, fontWeight: 700, color: showSortMenu ? '#288F4E' : '#374151' }}>
            {currentSort.label}
          </p>
        </button>

        {/* Sort Dropdown */}
        {showSortMenu && (
          <>
            <Box
              style={{ position: 'fixed', inset: 0, zIndex: 9 }}
              onClick={() => setShowSortMenu(false)}
            />
            <Box
              className="bg-white overflow-hidden"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 12,
                zIndex: 20,
                boxShadow: '0 10px 40px rgba(0,0,0,0.14)',
                minWidth: 188,
                borderRadius: 16,
                border: '1px solid #F0F0F0',
              }}
            >
              {/* Dropdown header */}
              <Box
                flex
                className="items-center justify-between"
                style={{ padding: '10px 14px 8px', borderBottom: '1px solid #F3F4F6' }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Sắp xếp theo
                </p>
                <button
                  onClick={() => setShowSortMenu(false)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={11} color="#6B7280" />
                </button>
              </Box>

              {SORT_OPTIONS.map((opt, i) => (
                <Box
                  key={opt.key}
                  flex
                  className="items-center cursor-pointer"
                  style={{
                    gap: 10,
                    padding: '11px 14px',
                    background: sortOrder === opt.key ? '#F0FDF4' : 'transparent',
                    borderBottom: i < SORT_OPTIONS.length - 1 ? '1px solid #F3F4F6' : 'none',
                  }}
                  onClick={() => { setSortOrder(opt.key); setShowSortMenu(false); }}
                >
                  <Box
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: sortOrder === opt.key ? '#DCFCE7' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: sortOrder === opt.key ? opt.color : '#9CA3AF',
                    }}
                  >
                    {opt.icon}
                  </Box>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: sortOrder === opt.key ? 700 : 500,
                      color: sortOrder === opt.key ? '#166534' : '#374151',
                      flex: 1,
                    }}
                  >
                    {opt.label}
                  </p>
                  {sortOrder === opt.key && (
                    <CheckCircle size={15} color="#288F4E" />
                  )}
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* ── Grid ── */}
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 11,
            padding: '12px 12px 20px',
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
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(145deg, #DCFCE7, #BBF7D0)',
                  boxShadow: '0 4px 16px rgba(40,143,78,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Gift size={34} color="#288F4E" />
              </Box>
              <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Chưa có phần thưởng</p>
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>Danh mục này chưa có phần thưởng nào</p>
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
