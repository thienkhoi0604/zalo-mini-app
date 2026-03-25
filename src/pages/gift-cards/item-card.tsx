import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { GiftCard } from "@/types/gift-card";

interface Props {
  card: GiftCard;
}

const GiftCardItemCard: FC<Props> = ({ card }) => {
  return (
    <Box
      className="flex gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Thumbnail Image */}
      <Box className="flex-shrink-0">
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          className="w-16 h-16 rounded object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://cdn-icons-png.flaticon.com/512/1170/1170678.png";
          }}
        />
      </Box>

      {/* Card Info */}
      <Box className="flex-1 min-w-0">
        <Text.Title className="text-sm font-semibold truncate">
          {card.name}
        </Text.Title>
        <Text className="text-xs text-gray-500 mt-1">
          {card.category}
        </Text>
        <Box className="flex items-center gap-2 mt-2">
          <Text className="text-xs font-bold text-orange-600">
            {card.pointsRequired} điểm
          </Text>
          {card.status === "expired" && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
              Hết hạn
            </span>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GiftCardItemCard;
