import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router';
import { Gift, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useRewardsStore } from '@/stores/rewards';
import { Reward } from '@/types/reward';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="bg-white rounded-2xl overflow-hidden animate-pulse"
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
  >
    <Box style={{ height: 110, background: '#E9EBED' }} />
    <Box className="p-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box style={{ height: 10, width: '45%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 13, width: '70%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 20, width: '40%', background: '#E9EBED', borderRadius: 8 }} />
    </Box>
  </Box>
);

// ─── Reward Card ──────────────────────────────────────────────────────────────

const RewardCard: FC<{ card: Reward; onClick: (card: Reward) => void }> = ({ card, onClick }) => (
  <Box
    onClick={() => onClick(card)}
    className="bg-white rounded-2xl overflow-hidden cursor-pointer"
    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'relative' }}
  >
    {/* Thumbnail */}
    <Box style={{ height: 110, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
      <img
        src={card.thumbnailImageUrl}
        alt={card.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
        }}
      />
      {card.status === 'expired' && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            style={{
              background: '#EF4444',
              borderRadius: 20,
              padding: '3px 10px',
            }}
          >
            <p style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>Hết hạn</p>
          </Box>
        </Box>
      )}
    </Box>

    {/* Info */}
    <Box className="p-3" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Brand */}
      <Box flex className="items-center" style={{ gap: 5 }}>
        {card.brandLogoUrl ? (
          <img
            src={card.brandLogoUrl}
            alt={card.brandName}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Box
            className="rounded-full flex-shrink-0"
            style={{ width: 14, height: 14, background: '#C49A6C' }}
          />
        )}
        <p
          className="truncate"
          style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}
        >
          {card.brandName || card.category}
        </p>
      </Box>

      {/* Name */}
      <p
        style={{
          fontSize: 12,
          color: '#1a1a1a',
          fontWeight: 700,
          lineHeight: '17px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: 34,
        }}
      >
        {card.name}
      </p>

      {/* Divider */}
      <Box style={{ height: 1, background: '#F3F4F6' }} />

      {/* Points badge */}
      <Box flex className="items-center" style={{ gap: 4 }}>
        <span style={{ fontSize: 14 }}>🪙</span>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#C49A6C' }}>
          {card.pointsRequired.toLocaleString('vi-VN')}
        </p>
        <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>xu</p>
      </Box>
    </Box>
  </Box>
);

// ─── Sort Button ──────────────────────────────────────────────────────────────

type SortOrder = 'asc' | 'desc' | 'default';

const SORT_LABELS: Record<SortOrder, string> = {
  default: 'Mặc định',
  asc: 'Ít xu nhất',
  desc: 'Nhiều xu nhất',
};

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

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>
      {/* ── Category Banner ─────────────────────────────────────────────── */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)',
          padding: '16px 16px 20px',
        }}
      >
        <Box flex className="items-center" style={{ gap: 10 }}>
          <Box
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.18)' }}
          >
            <Gift size={22} color="#fff" />
          </Box>
          <Box style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: '24px' }}>
              {decodedCategory}
            </p>
            {!isLoading && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                {cards.length} phần thưởng
              </p>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Sort Bar ────────────────────────────────────────────────────── */}
      <Box
        flex
        className="items-center justify-between bg-white px-4 py-2"
        style={{
          borderBottom: '1px solid #F0F0F0',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <p style={{ fontSize: 12, color: '#6B7280' }}>
          {isLoading ? '—' : `${cards.filter((c) => c.status === 'active').length} khả dụng`}
        </p>

        <Box
          flex
          className="items-center cursor-pointer"
          style={{ gap: 5 }}
          onClick={() => setShowSortMenu((v) => !v)}
        >
          <ArrowUpDown size={13} color="#374151" />
          <p style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            {SORT_LABELS[sortOrder]}
          </p>
        </Box>

        {/* Sort Dropdown */}
        {showSortMenu && (
          <>
            <Box
              style={{ position: 'fixed', inset: 0, zIndex: 9 }}
              onClick={() => setShowSortMenu(false)}
            />
            <Box
              className="bg-white rounded-xl overflow-hidden"
              style={{
                position: 'absolute',
                top: '100%',
                right: 12,
                zIndex: 20,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 170,
                border: '1px solid #F0F0F0',
              }}
            >
              {(['default', 'asc', 'desc'] as SortOrder[]).map((opt) => (
                <Box
                  key={opt}
                  flex
                  className="items-center cursor-pointer px-4 py-3"
                  style={{
                    gap: 10,
                    background: sortOrder === opt ? '#EEF7F1' : 'transparent',
                    borderBottom: opt !== 'desc' ? '1px solid #F3F4F6' : 'none',
                  }}
                  onClick={() => {
                    setSortOrder(opt);
                    setShowSortMenu(false);
                  }}
                >
                  {opt === 'asc' && <TrendingDown size={14} color="#288F4E" />}
                  {opt === 'desc' && <TrendingUp size={14} color="#C49A6C" />}
                  {opt === 'default' && <ArrowUpDown size={14} color="#9CA3AF" />}
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: sortOrder === opt ? 700 : 500,
                      color: sortOrder === opt ? '#288F4E' : '#374151',
                    }}
                  >
                    {SORT_LABELS[opt]}
                  </p>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <Box
        className="flex-1 overflow-y-auto p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          alignContent: 'start',
        }}
      >
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </>
        ) : cards.length === 0 ? (
          <Box
            className="col-span-2 flex flex-col items-center justify-center"
            style={{ paddingTop: 64, gap: 14 }}
          >
            <Box
              className="flex items-center justify-center rounded-full"
              style={{ width: 72, height: 72, background: '#EEF7F1' }}
            >
              <Gift size={32} color="#288F4E" />
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Chưa có phần thưởng</p>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                Danh mục này chưa có phần thưởng nào
              </p>
            </Box>
          </Box>
        ) : (
          <>
            {cards.map((card) => (
              <RewardCard
                key={card.id}
                card={card}
                onClick={(c) => navigate(`/rewards/${c.id}`)}
              />
            ))}

            {/* Bottom padding */}
            <Box className="col-span-2" style={{ height: 12 }} />
          </>
        )}
      </Box>
    </Page>
  );
};

export default CategoryDetailPage;
