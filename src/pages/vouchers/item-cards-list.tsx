import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { LayoutGrid, Gift, Ticket, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher } from '@/types/voucher';
import VoucherItemCard from './item-card';
import { useNavigate } from 'react-router';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="flex-shrink-0 animate-pulse"
    style={{ width: 160, borderRadius: 18, overflow: 'hidden', background: '#F3F4F6' }}
  >
    <Box style={{ height: 120, background: '#E9EBED' }} />
    <Box style={{ padding: '9px 10px 11px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ height: 9, width: '40%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 13, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <Box style={{ height: 28, background: '#E9EBED', borderRadius: 9, marginTop: 2 }} />
    </Box>
  </Box>
);

// ─── Category config ───────────────────────────────────────────────────────────

interface CategoryConfig {
  accent: string;
  accentLight: string;
  accentMid: string;
  icon: React.ReactNode;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  { accent: '#288F4E', accentLight: '#DCFCE7', accentMid: '#BBF7D0', icon: <Ticket size={16} strokeWidth={2} /> },
  { accent: '#D97706', accentLight: '#FEF3C7', accentMid: '#FDE68A', icon: <ShoppingBag size={16} strokeWidth={2} /> },
  { accent: '#7C3AED', accentLight: '#EDE9FE', accentMid: '#DDD6FE', icon: <Gift size={16} strokeWidth={2} /> },
  { accent: '#0891B2', accentLight: '#CFFAFE', accentMid: '#A5F3FC', icon: <UtensilsCrossed size={16} strokeWidth={2} /> },
  { accent: '#DB2777', accentLight: '#FCE7F3', accentMid: '#FBCFE8', icon: <Ticket size={16} strokeWidth={2} /> },
  { accent: '#059669', accentLight: '#D1FAE5', accentMid: '#A7F3D0', icon: <ShoppingBag size={16} strokeWidth={2} /> },
];

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string;
  cards: Voucher[];
  config: CategoryConfig;
}

const CategoryRow: FC<CategoryRowProps> = ({ category, cards, config }) => {
  const navigate = useNavigate();
  const { accent, accentLight, accentMid, icon } = config;
  const visibleCards = cards.slice(0, 8);
  const extra = cards.length - 8;
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
      {/* Accent top bar */}
      <Box style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accentMid})` }} />

      {/* Header */}
      <Box
        flex
        className="items-center justify-between"
        style={{ padding: '13px 14px 11px' }}
      >
        <Box flex className="items-center" style={{ gap: 10 }}>
          <Box
            style={{
              width: 38, height: 38, borderRadius: 11,
              background: accentLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: accent,
            }}
          >
            {icon}
          </Box>

          <Box>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: '18px' }}>
              {category}
            </p>
            <Box flex className="items-center" style={{ gap: 5, marginTop: 2 }}>
              <Box
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  background: accentLight, borderRadius: 20, padding: '1px 7px',
                }}
              >
                <Box style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
                <p style={{ fontSize: 10, color: accent, fontWeight: 700 }}>
                  {cards.length} mục
                </p>
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Horizontal scroll */}
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
          justifyContent: 'flex-start',
        }}
      >
        {visibleCards.map((card) => (
          <VoucherItemCard
            key={card.id}
            card={card}
            onClick={(c) => navigate(`/rewards/${c.id}`)}
          />
        ))}

        {/* View-all end card */}
        <div
          className="flex-shrink-0 cursor-pointer"
          style={{
            width: 64,
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onClick={() => navigate(`/rewards/category/${encodeURIComponent(category)}`)}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#288F4E',
              boxShadow: '0 4px 16px rgba(40,143,78,0.28), 0 1px 4px rgba(40,143,78,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LayoutGrid size={18} color="#fff" strokeWidth={2} />
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#288F4E', letterSpacing: 0.3, textAlign: 'center' }}>Tất cả</p>
        </div>
      </Box>
    </Box>
  );
};

// ─── Main List ────────────────────────────────────────────────────────────────

const VouchersList: FC = () => {
  const { getGroupedByCategory } = useVouchersStore();
  const grouped = getGroupedByCategory();
  const categories = Object.keys(grouped).sort();

  if (categories.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 14 }}>
        <Box
          style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'linear-gradient(145deg, #FEF9EF, #FEF3C7)',
            boxShadow: '0 6px 20px rgba(217,119,6,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Gift size={36} color="#D97706" />
        </Box>
        <Box style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#374151' }}>Chưa có voucher</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Hãy quay lại sau nhé!</p>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 12 }}>
      {categories.map((category, i) => (
        <CategoryRow
          key={category}
          category={category}
          cards={grouped[category]}
          config={CATEGORY_CONFIGS[i % CATEGORY_CONFIGS.length]}
        />
      ))}
    </Box>
  );
};

export default VouchersList;
