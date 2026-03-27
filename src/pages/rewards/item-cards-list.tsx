import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { ChevronRight, Gift } from 'lucide-react';
import { useRewardsStore } from '@/stores/rewards';
import { Reward } from '@/types/reward';
import RewardItemCard from './item-card';
import { useNavigate } from 'react-router';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse"
    style={{ width: 148, background: '#F3F4F6' }}
  >
    <Box style={{ height: 96, background: '#E9EBED' }} />
    <Box style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ height: 10, width: '50%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
    </Box>
  </Box>
);

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string;
  cards: Reward[];
}

const CategoryRow: FC<CategoryRowProps> = ({ category, cards }) => {
  const navigate = useNavigate();
  const visibleCards = cards.slice(0, 8);
  const extra = cards.length - 8;

  return (
    <Box style={{ paddingBottom: 4 }}>
      {/* Header */}
      <Box flex className="items-center justify-between px-4 mb-3">
        <Box flex className="items-center" style={{ gap: 8 }}>
          <Box
            style={{
              width: 4,
              height: 20,
              borderRadius: 2,
              background: 'linear-gradient(180deg, #E8CFA0, #A0784A)',
              flexShrink: 0,
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{category}</p>
          <Box style={{ background: '#FEF9EF', border: '1px solid #FDE68A', borderRadius: 100, padding: '1px 8px' }}>
            <p style={{ fontSize: 11, color: '#D97706', fontWeight: 700 }}>{cards.length}</p>
          </Box>
        </Box>

        <Box
          flex
          className="items-center cursor-pointer"
          style={{ gap: 2 }}
          onClick={() => navigate(`/rewards/category/${encodeURIComponent(category)}`)}
        >
          <p style={{ fontSize: 13, color: '#C49A6C', fontWeight: 600 }}>Xem tất cả</p>
          <ChevronRight size={14} color="#C49A6C" strokeWidth={2.5} />
        </Box>
      </Box>

      {/* Horizontal scroll */}
      <Box
        flex
        style={{
          overflowX: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
          gap: 10,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
        }}
      >
        {visibleCards.map((card) => (
          <RewardItemCard
            key={card.id}
            card={card}
            onClick={(c) => navigate(`/rewards/${c.id}`)}
          />
        ))}

        {/* View-all end card */}
        {extra > 0 && (
          <Box
            onClick={() => navigate(`/rewards/category/${encodeURIComponent(category)}`)}
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
            style={{
              width: 100,
              minHeight: 150,
              background: 'linear-gradient(135deg, #FEF9EF, #FEF3C7)',
              border: '1.5px dashed #F0C97A',
              gap: 8,
            }}
          >
            <Box
              className="flex items-center justify-center rounded-full"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)' }}
            >
              <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
            </Box>
            <p style={{ fontSize: 11, color: '#A0784A', fontWeight: 700, textAlign: 'center', lineHeight: '15px' }}>
              +{extra} ưu đãi
            </p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Main List ────────────────────────────────────────────────────────────────

const RewardsList: FC = () => {
  const { getGroupedByCategory } = useRewardsStore();
  const grouped = getGroupedByCategory();
  const categories = Object.keys(grouped).sort();

  if (categories.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 12 }}>
        <Box
          className="flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, background: '#FEF9EF' }}
        >
          <Gift size={32} color="#C49A6C" />
        </Box>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Chưa có phần thưởng</p>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>Hãy quay lại sau nhé!</p>
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {categories.map((category) => (
        <CategoryRow key={category} category={category} cards={grouped[category]} />
      ))}
    </Box>
  );
};

export default RewardsList;
