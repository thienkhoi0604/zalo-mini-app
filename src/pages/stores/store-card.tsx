import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import type { Store } from "types/store";
import {
  OpenStatusBadge,
  CapacityBadge,
  ChargerCountMetric,
} from "./store-badges";

interface Props {
  store: Store;
  onClick: () => void;
}

const StoreCard: FC<Props> = ({ store, onClick }) => {
  return (
    <Box
      onClick={onClick}
      className="flex gap-4 p-4 mb-3 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      {/* Thumbnail Image */}
      <Box className="flex-shrink-0">
        <img
          src={store.thumbnailImageUrl}
          alt={store.name}
          className="w-16 h-16 rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/64x64?text=Station";
          }}
        />
      </Box>

      {/* Store Info */}
      <Box className="flex-1 min-w-0 space-y-2">
        {/* Name with Badge */}
        <Box className="flex items-center gap-2 flex-wrap">
          <Text className="text-sm font-semibold text-gray-900 truncate flex-1">
            {store.name}
          </Text>
          <OpenStatusBadge openingHours={store.openingHours} />
        </Box>

        {/* Address */}
        <Text className="text-xs text-gray-600 line-clamp-1">
          {store.address}
        </Text>

        {/* Metrics Row */}
        <Box className="flex items-center gap-2 flex-wrap pt-1">
          <ChargerCountMetric count={store.chargerCount} />
          <CapacityBadge capacity={store.chargingCapacity} />
        </Box>
      </Box>
    </Box>
  );
};

export default StoreCard;
