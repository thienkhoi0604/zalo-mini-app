import React, { FC, useState } from "react";
import { Box, Text } from "zmp-ui";
import { useGiftCardsStore } from "stores/gift-cards";
import MyCardItem from "./my-card-item";

const MyGiftCardsList: FC = () => {
  const { userGiftCards, allGiftCards } = useGiftCardsStore();
  const [selectedStatus, setSelectedStatus] = useState<"all" | "redeemed" | "received">("all");

  const filtered = userGiftCards.filter((card) => {
    if (selectedStatus === "all") return true;
    return card.status === selectedStatus;
  });

  if (userGiftCards.length === 0) {
    return (
      <Box className="text-center py-8">
        <Text>Bạn chưa có thẻ quà tặng nào</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filter Tabs */}
      <Box className="flex gap-2 mb-4 overflow-x-auto">
        {["all", "redeemed", "received"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStatus === status
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "all"
              ? "Tất Cả"
              : status === "redeemed"
              ? "Đã Dùng"
              : "Đã Nhận"}
          </button>
        ))}
      </Box>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <Box className="text-center py-8">
          <Text className="text-gray-500">
            Không có thẻ quà tặng{" "}
            {selectedStatus === "all"
              ? ""
              : selectedStatus === "redeemed"
              ? " đã dùng"
              : " đã nhận"}
          </Text>
        </Box>
      ) : (
        <Box className="space-y-3">
          {filtered
            .map((userCard) => ({
              userCard,
              cardDetails: allGiftCards.find((c) => c.id === userCard.giftCardId),
            }))
            .filter(({ cardDetails }) => cardDetails !== undefined)
            .map(({ userCard, cardDetails }) => (
              <MyCardItem
                key={userCard.id}
                userCard={userCard}
                cardDetails={cardDetails!}
              />
            ))}
        </Box>
      )}
    </Box>
  );
};

export default MyGiftCardsList;
