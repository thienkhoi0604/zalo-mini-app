import React, { FC, useEffect } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router';
import { useRewardsStore } from '@/stores/rewards';
import { Reward } from '@/types/reward';
import RewardItemCard from '../item-card';

const CategoryDetailPage: FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { getGroupedByCategory, loadAllRewards, allRewards } =
    useRewardsStore();

  const decodedCategory = decodeURIComponent(category || '');

  useEffect(() => {
    if (!allRewards.length) {
      loadAllRewards().catch(() => {
        openSnackbar({ text: 'Không thể tải danh sách', type: 'error' });
      });
    }
  }, []);

  const grouped = getGroupedByCategory();
  const cards: Reward[] = grouped[decodedCategory] || [];

  const handleCardClick = (card: Reward) => {
    navigate(`/rewards/${card.id}`);
  };

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      {/* Grid */}
      <Box
        className="flex-1 overflow-y-auto p-4 pt-6"
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
              <RewardItemCard card={{ ...card }} onClick={handleCardClick} />
            </Box>
          ))
        )}
      </Box>
    </Page>
  );
};

export default CategoryDetailPage;
