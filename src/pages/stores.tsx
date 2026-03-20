import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page, Text } from 'zmp-ui';
import type { Store } from 'types/store';
import { MOCK_STORES } from 'mock/stores';
import StoreCard from './stores/store-card';
import AppHeader from 'components/app-header';

export const StoresPage: FC = () => {
  const navigate = useNavigate();
  const stores: Store[] = MOCK_STORES;

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <AppHeader title="" showGreeting />

      <Box className="flex-1 overflow-auto px-4 pt-4">
        {/* Title danh sách */}
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Hệ thống trạm sạc pin
        </Text>

        {stores.length === 0 ? (
          <Box className="py-8 text-center">
            <Text className="text-gray-500">
              Không tìm thấy trạm sạc pin phù hợp.
            </Text>
          </Box>
        ) : (
          <Box className="pb-4">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(`/stores/${store.id}`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default StoresPage;
