import React, { FC } from "react";
import { useNavigate } from "react-router";
import { Box, Page, Text } from "zmp-ui";
import type { Store } from "types/store";
import { MOCK_STORES } from "mock/stores";
import StoreCard from "./stores/store-card";

export const StoresPage: FC = () => {
  const navigate = useNavigate();
  const stores: Store[] = MOCK_STORES;

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Box p={4} className="bg-white">
        <Text size="large" className="font-semibold text-gray-900">
          Hệ thống trạm sạc pin
        </Text>
      </Box>

      <Box className="flex-1 overflow-auto px-4">
        {stores.length === 0 && (
          <Box p={4}>
            <Text>Không tìm thấy trạm sạc pin phù hợp.</Text>
          </Box>
        )}
        {stores.length > 0 && (
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
