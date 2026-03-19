import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { GiftCard, UserGiftCard } from "@/types/gift-card";

interface Props {
  userCard: UserGiftCard;
  cardDetails: GiftCard;
}

const MyCardItem: FC<Props> = ({ userCard, cardDetails }) => {
  const getStatusLabel = (status: string) => {
    return status === "redeemed" ? "Đã Dùng" : "Đã Nhận";
  };

  const getStatusColor = (status: string) => {
    return status === "redeemed"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Box className="flex gap-3 p-3 border border-gray-200 rounded-lg">
      {/* Thumbnail Image */}
      <Box className="flex-shrink-0">
        <img
          src={cardDetails.thumbnailImageUrl}
          alt={cardDetails.name}
          className="w-16 h-16 rounded object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/64x64?text=Card";
          }}
        />
      </Box>

      {/* Card Info */}
      <Box className="flex-1 min-w-0">
        <Text.Title className="text-sm font-semibold truncate">
          {cardDetails.name}
        </Text.Title>
        <Text className="text-xs text-gray-500 mt-1">
          {cardDetails.category}
        </Text>
        <Box className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(
              userCard.status
            )}`}
          >
            {getStatusLabel(userCard.status)}
          </span>
          <Text className="text-xs text-gray-500">
            {userCard.status === "redeemed"
              ? `Ngày: ${formatDate(userCard.redeemedAt)}`
              : `Ngày: ${formatDate(userCard.receivedAt)}`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default MyCardItem;
