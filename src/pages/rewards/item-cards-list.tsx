import React, { FC, useEffect } from 'react';
import { Box } from 'zmp-ui';
import { Gift, ChevronRight } from 'lucide-react';
import voucherIcon from '@/assets/images/voucher-icon.png';
import SectionHeader from '@/components/ui/section-header';
import { FALLBACK_IMAGES } from '@/constants';
import ViewAllFab from '@/components/ui/view-all-fab';
import { useVouchersStore, OTHER_CATEGORY_ID } from '@/store/vouchers';
import { AppCategory, Voucher } from '@/types/voucher';
import VoucherCard from './voucher-card';
import { useNavigate } from 'react-router';

// ─── Category colours (cycled) ────────────────────────────────────────────────

const PALETTE = [
  { accent: '#288F4E', accentLight: '#DCFCE7', accentMid: '#BBF7D0' },
  { accent: '#D97706', accentLight: '#FEF3C7', accentMid: '#FDE68A' },
  { accent: '#7C3AED', accentLight: '#EDE9FE', accentMid: '#DDD6FE' },
  { accent: '#0891B2', accentLight: '#CFFAFE', accentMid: '#A5F3FC' },
  { accent: '#DB2777', accentLight: '#FCE7F3', accentMid: '#FBCFE8' },
  { accent: '#059669', accentLight: '#D1FAE5', accentMid: '#A7F3D0' },
];

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: AppCategory;
  cards: Voucher[];
  paletteIndex: number;
}

const CategoryRow: FC<CategoryRowProps> = ({ category, cards, paletteIndex }) => {
  const navigate = useNavigate();
  const { accent, accentLight, accentMid } = PALETTE[paletteIndex % PALETTE.length];
  const visibleCards = cards.slice(0, 8);

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
              overflow: 'hidden',
            }}
          >
            <img
              src={category.imageUrl || FALLBACK_IMAGES.reward}
              alt={category.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGES.reward; }}
            />
          </Box>

          <Box>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: '18px' }}>
              {category.name}
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

        <Box
          flex
          className="items-center cursor-pointer"
          style={{ gap: 2 }}
          onClick={() => navigate(`/rewards/category/${category.id}`)}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: accent }}>Tất cả</p>
          <ChevronRight size={14} color={accent} strokeWidth={2.5} />
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
          <VoucherCard
            key={card.id}
            card={card}
            width={155}
            onClick={(c) => navigate(c.source === 'StoreItem' ? `/products/${c.id}` : `/rewards/${c.id}`)}
          />
        ))}

        {cards.length > 2 && (
          <ViewAllFab onClick={() => navigate(`/rewards/category/${category.id}`)} />
        )}
      </Box>
    </Box>
  );
};

// ─── Main List ────────────────────────────────────────────────────────────────

const VouchersList: FC = () => {
  const { categories, categoriesLoading, loadCategories, getGroupedByCategory } = useVouchersStore();
  const grouped = getGroupedByCategory();

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      loadCategories();
    }
  }, []);

  const visibleCategories = categories.filter((cat) => grouped[cat.id]?.length > 0);
  const otherVouchers = grouped[OTHER_CATEGORY_ID] ?? [];
  const hasOther = otherVouchers.length > 0;

  if (categoriesLoading && categories.length === 0) {
    return null; // parent already shows skeleton
  }

  if (visibleCategories.length === 0 && !hasOther) {
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
      <SectionHeader
        title="Danh mục"
        icon={<Gift size={14} color="#fff" />}
        className=""
      />

      {visibleCategories.map((category, i) => (
        <CategoryRow
          key={category.id}
          category={category}
          cards={grouped[category.id]}
          paletteIndex={i}
        />
      ))}

      {hasOther && (
        <CategoryRow
          key={OTHER_CATEGORY_ID}
          category={{ id: OTHER_CATEGORY_ID, name: 'Khác', imageUrl: voucherIcon, storeItemCount: 0, rewardCount: 0 }}
          cards={otherVouchers}
          paletteIndex={visibleCategories.length}
        />
      )}
    </Box>
  );
};

export default VouchersList;
