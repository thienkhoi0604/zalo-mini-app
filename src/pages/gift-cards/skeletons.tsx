import React, { FC } from "react";
import { Box } from "zmp-ui";

export const GiftCardSkeleton: FC = () => (
  <Box className="flex gap-3 p-3 border border-gray-200 rounded-lg">
    <Box className="w-16 h-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
    <Box className="flex-1 space-y-2">
      <Box className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <Box className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      <Box className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
    </Box>
  </Box>
);

export const GiftCardsListSkeleton: FC = () => (
  <Box className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Box key={i}>
        <Box className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse" />
        <Box className="space-y-3">
          <GiftCardSkeleton />
          <GiftCardSkeleton />
        </Box>
      </Box>
    ))}
  </Box>
);
