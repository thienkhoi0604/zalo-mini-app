import React, { FC, useEffect, useState } from "react";
import { Box, Text } from "zmp-ui";
import { useGiftCardsStore } from "stores/gift-cards";
import { useUserStore } from "stores/user";
import { UserGiftCard, GiftCard } from "@/types/gift-card";
import MyCardItem from "./gift-cards/my-card-item";

const MyGiftCardsSection: FC = () => {
  const { userGiftCards, allGiftCards, loadUserGiftCards, loadAllGiftCards } =
    useGiftCardsStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await loadAllGiftCards();
        await loadUserGiftCards();
      } catch (error) {
        console.error("Failed to load gift cards:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getCardDetails = (userCard: UserGiftCard): GiftCard | undefined => {
    return allGiftCards.find((c) => c.id === userCard.giftCardId);
  };

  const validCards = userGiftCards
    .map((userCard) => ({
      userCard,
      cardDetails: getCardDetails(userCard),
    }))
    .filter((item) => item.cardDetails !== undefined);

  return (
    <Box className="m-4 mt-6">
      <Box className="mb-3">
        <Text.Title className="text-base font-bold">💳 Thẻ Quà Tặng Của Tôi</Text.Title>
      </Box>

      {/* Points Info */}
      {user && (
        <Box className="grid grid-cols-2 gap-2 mb-4">
          <Box className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <Text className="text-xs text-orange-600 font-medium">Điểm Tích Lũy</Text>
            <Text.Title className="text-xl font-bold text-orange-600">
              {user.points || 0}
            </Text.Title>
          </Box>
          <Box className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Text className="text-xs text-blue-600 font-medium">Điểm Xếp Hạng</Text>
            <Text.Title className="text-xl font-bold text-blue-600">
              {user.ratingPoints || 0}
            </Text.Title>
          </Box>
        </Box>
      )}

      {loading ? (
        <Box className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </Box>
      ) : validCards.length === 0 ? (
        <Box className="bg-gray-50 p-4 rounded-lg text-center">
          <Text className="text-sm text-gray-500">
            Bạn chưa có thẻ quà tặng nào
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            Hãy đến mục "Thẻ Quà Tặng" để đổi điểm lấy thẻ
          </Text>
        </Box>
      ) : (
        <Box className="space-y-3">
          {validCards.map(({ userCard, cardDetails }) => (
            <MyCardItem
              key={userCard.id}
              userCard={userCard}
              cardDetails={cardDetails!}
            />
          ))}
          <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Text className="text-xs text-blue-700">
              📌 Bạn có{" "}
              <span className="font-bold">{validCards.filter((c) => c.userCard.status === "redeemed").length}</span> thẻ đã dùng
              và{" "}
              <span className="font-bold">{validCards.filter((c) => c.userCard.status === "received").length}</span> thẻ
              đã nhận
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MyGiftCardsSection;
