import React, { FC } from 'react';
import { Box } from 'zmp-ui';
import { useGiftCardsStore } from 'stores/gift-cards';
import { GiftCard } from '@/types/gift-card';
import GiftCardItemCard from './item-card';
import { useNavigate } from 'react-router-dom';

// ─── Category Row ─────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string;
  cards: GiftCard[];
}

const CategoryRow: FC<CategoryRowProps> = ({ category, cards }) => {
  const navigate = useNavigate();

  const handleCardClick = (card: GiftCard) => {
    navigate(`/gift-cards/${card.id}`);
  };

  const handleViewAll = () => {
    navigate(`/gift-cards/category/${encodeURIComponent(category)}`);
  };

  // Show max 7 in the scroll row
  const visibleCards = cards.slice(0, 7);

  return (
    <Box className="mb-1">
      {/* Row header */}
      <Box flex className="items-center justify-between px-4 mb-3">
        <Box flex className="items-center" style={{ gap: 8 }}>
          <Box
            className="rounded-full flex-shrink-0"
            style={{
              width: 4,
              height: 18,
              background: 'linear-gradient(180deg, #C49A6C, #A0784A)',
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
            {category}
          </p>
          <Box
            className="rounded-full"
            style={{ background: '#F5F0E8', padding: '2px 8px' }}
          >
            <p style={{ fontSize: 11, color: '#A0784A', fontWeight: 600 }}>
              {cards.length}
            </p>
          </Box>
        </Box>

        <Box
          flex
          className="items-center cursor-pointer"
          style={{ gap: 3 }}
          onClick={handleViewAll}
        >
          <p style={{ fontSize: 13, color: '#C49A6C', fontWeight: 600 }}>
            Xem tất cả
          </p>
          <span style={{ color: '#C49A6C', fontSize: 15, lineHeight: 1 }}>
            ›
          </span>
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
          <GiftCardItemCard
            key={card.id}
            card={card}
            onClick={handleCardClick}
          />
        ))}

        {/* "View all" card at the end if more than 7 */}
        {cards.length > 7 && (
          <Box
            onClick={handleViewAll}
            className="flex-shrink-0 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer"
            style={{
              width: 100,
              height: 155,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              gap: 8,
            }}
          >
            <Box
              className="flex items-center justify-center rounded-full"
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #C49A6C, #A0784A)',
              }}
            >
              <span style={{ color: '#fff', fontSize: 20, lineHeight: 1 }}>
                ›
              </span>
            </Box>
            <p
              style={{
                fontSize: 12,
                color: '#A0784A',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: '16px',
              }}
            >
              Xem thêm {cards.length - 7} mã
            </p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Main List ────────────────────────────────────────────────────────────────

const GiftCardsList: FC = () => {
  const { getGroupedByCategory } = useGiftCardsStore();
  const grouped = getGroupedByCategory();
  const categories = Object.keys(grouped).sort();

  if (categories.length === 0) {
    return (
      <Box
        className="flex flex-col items-center justify-center py-16"
        style={{ gap: 8 }}
      >
        <span style={{ fontSize: 40 }}>🎁</span>
        <p style={{ fontSize: 14, color: '#888' }}>
          Không có thẻ quà tặng nào có sẵn
        </p>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col" style={{ gap: 20 }}>
      {categories.map((category) => (
        <CategoryRow
          key={category}
          category={category}
          cards={grouped[category]}
        />
      ))}
    </Box>
  );
};

export default GiftCardsList;
