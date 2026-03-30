import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { ArrowRight, Gift, Tag } from 'lucide-react';
import { useRewardsStore } from '@/stores/rewards';
import { Reward } from '@/types/reward';
import RewardItemCard from './item-card';
import { useNavigate } from 'react-router';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="flex-shrink-0 animate-pulse"
    style={{ width: 156, borderRadius: 16, overflow: 'hidden', background: '#F3F4F6' }}
  >
    <Box style={{ height: 108, background: '#E9EBED' }} />
    <Box style={{ padding: '9px 11px 11px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ height: 9, width: '40%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 26, width: '70%', background: '#E9EBED', borderRadius: 8, marginTop: 2 }} />
    </Box>
  </Box>
);

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string;
  cards: Reward[];
  accent: string;
  accentLight: string;
}

const ACCENTS = [
  { accent: '#288F4E', accentLight: '#DCFCE7' },
  { accent: '#D97706', accentLight: '#FEF3C7' },
  { accent: '#7C3AED', accentLight: '#EDE9FE' },
  { accent: '#0891B2', accentLight: '#CFFAFE' },
  { accent: '#DB2777', accentLight: '#FCE7F3' },
  { accent: '#059669', accentLight: '#D1FAE5' },
];

const CategoryRow: FC<CategoryRowProps> = ({ category, cards, accent, accentLight }) => {
  const navigate = useNavigate();
  const visibleCards = cards.slice(0, 8);
  const extra = cards.length - 8;

  return (
    <Box
      style={{
        margin: '0 12px',
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <Box
        flex
        className="items-center justify-between"
        style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${accentLight}` }}
      >
        <Box flex className="items-center" style={{ gap: 10 }}>
          {/* Accent icon */}
          <Box
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Tag size={15} color={accent} strokeWidth={2.2} />
          </Box>

          <Box>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: '18px' }}>{category}</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 1 }}>
              {cards.length} phần thưởng
            </p>
          </Box>
        </Box>

        <Box
          flex
          className="items-center cursor-pointer"
          style={{
            gap: 4,
            background: accent,
            borderRadius: 20,
            padding: '5px 11px 5px 12px',
            boxShadow: `0 2px 8px ${accent}44`,
          }}
          onClick={() => navigate(`/rewards/category/${encodeURIComponent(category)}`)}
        >
          <p style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>Xem tất cả</p>
          <ArrowRight size={11} color="#fff" strokeWidth={2.5} />
        </Box>
      </Box>

      {/* Horizontal scroll */}
      <Box
        flex
        style={{
          overflowX: 'auto',
          padding: '12px 14px 14px',
          gap: 10,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
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
            className="flex-shrink-0 flex flex-col items-center justify-center cursor-pointer"
            style={{
              width: 90,
              minHeight: 156,
              borderRadius: 16,
              background: accentLight,
              border: `1.5px dashed ${accent}66`,
              gap: 8,
            }}
          >
            <Box
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 3px 10px ${accent}44`,
              }}
            >
              <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: accent, fontWeight: 800 }}>+{extra}</p>
              <p style={{ fontSize: 10, color: accent, fontWeight: 600, opacity: 0.8 }}>ưu đãi</p>
            </Box>
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
      <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 14 }}>
        <Box
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #FEF9EF, #FEF3C7)',
            boxShadow: '0 4px 16px rgba(217,119,6,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Gift size={34} color="#D97706" />
        </Box>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Chưa có phần thưởng</p>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>Hãy quay lại sau nhé!</p>
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 8 }}>
      {categories.map((category, i) => {
        const { accent, accentLight } = ACCENTS[i % ACCENTS.length];
        return (
          <CategoryRow
            key={category}
            category={category}
            cards={grouped[category]}
            accent={accent}
            accentLight={accentLight}
          />
        );
      })}
    </Box>
  );
};

export default RewardsList;
