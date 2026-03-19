import React, { FC, useEffect, useState } from "react";
import { Box, Header, Page, useSnackbar } from "zmp-ui";
import { useGiftCardsStore } from "stores/gift-cards";
import GiftCardsList from "./gift-cards/list";

const GiftCardsPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const { loading, loadAllGiftCards, loadUserGiftCards } =
    useGiftCardsStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAllGiftCards();
        await loadUserGiftCards();
        setInitialized(true);
      } catch (error) {
        openSnackbar({
          text: "Không thể tải danh sách thẻ quà tặng",
          type: "error",
        });
        setInitialized(true);
      }
    };

    initializeData();
  }, []);

  return (
    <Page>
      <Header showBackIcon={false} title="Thẻ Quà Tặng" />

      <Box className="p-4">
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
