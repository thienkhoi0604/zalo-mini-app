import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useGiftCardsStore } from "stores/gift-cards";
import GiftCardItemCard from "./item-card";

const GiftCardsList: FC = () => {
  const { getGroupedByCategory } = useGiftCardsStore();
  const grouped = getGroupedByCategory();

  const categories = Object.keys(grouped).sort();

  if (categories.length === 0) {
    return (
      <Box className="text-center py-8">
        <Text>Không có thẻ quà tặng nào có sẵn</Text>
      </Box>
    );
  }

  return (
    <Box>
      {categories.map((category) => (
        <Box key={category} className="mb-6">
          <Text.Title className="text-sm font-bold text-gray-600 uppercase mb-3">
            {category}
          </Text.Title>
          <Box className="space-y-3">
            {grouped[category].map((card) => (
              <GiftCardItemCard
                key={card.id}
                card={card}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GiftCardsList;
