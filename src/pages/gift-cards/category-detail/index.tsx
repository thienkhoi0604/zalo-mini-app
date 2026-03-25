import React, { FC, useEffect } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router-dom';
import { useGiftCardsStore } from 'stores/gift-cards';
import { GiftCard } from '@/types/gift-card';
import GiftCardItemCard from '../item-card';

const CategoryDetailPage: FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { getGroupedByCategory, loadAllGiftCards, allGiftCards } =
    useGiftCardsStore();

  const decodedCategory = decodeURIComponent(category || '');

  useEffect(() => {
    if (!allGiftCards.length) {
      loadAllGiftCards().catch(() => {
        openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
      });
    }
  }, []);

  const grouped = getGroupedByCategory();
  const cards: GiftCard[] = grouped[decodedCategory] || [];

  const handleCardClick = (card: GiftCard) => {
    navigate(`/gift-cards/${card.id}`);
  };

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <Box
        flex
        className="items-center bg-white px-4 py-3"
        style={{ gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Box style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
            {decodedCategory}
          </p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
            {cards.length} thẻ quà tặng
          </p>
        </Box>
      </Box>

      {/* Grid */}
      <Box
        className="flex-1 overflow-y-auto p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          alignContent: 'start',
        }}
      >
        {cards.length === 0 ? (
          <Box
            className="col-span-2 flex flex-col items-center justify-center py-16"
            style={{ gap: 8 }}
          >
            <span style={{ fontSize: 40 }}>🎁</span>
            <p style={{ fontSize: 14, color: '#888' }}>
              Không có thẻ nào trong danh mục này
            </p>
          </Box>
        ) : (
          cards.map((card) => (
            <Box key={card.id} style={{ width: '100%' }}>
              <GiftCardItemCard card={{ ...card }} onClick={handleCardClick} />
            </Box>
          ))
        )}
      </Box>
    </Page>
  );
};

export default CategoryDetailPage;
