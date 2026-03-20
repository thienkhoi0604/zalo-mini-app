import React, { FC, useEffect, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useGiftCardsStore } from 'stores/gift-cards';
import GiftCardsList from './gift-cards/list';
import AppHeader from 'components/app-header';

const GiftCardsPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const { loading, loadAllGiftCards, loadUserGiftCards } = useGiftCardsStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAllGiftCards();
        await loadUserGiftCards();
        setInitialized(true);
      } catch {
        openSnackbar({
          text: 'Không thể tải danh sách thẻ quà tặng',
          type: 'error',
        });
        setInitialized(true);
      }
    };
    initializeData();
  }, []);

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <AppHeader title="" showGreeting />

      <Box className="p-4">
        <p className="text-base font-semibold text-gray-900 mb-3">
          Thẻ Quà Tặng
        </p>

        {!initialized && loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <GiftCardsList />
        )}
      </Box>
    </Page>
  );
};

export default GiftCardsPage;
