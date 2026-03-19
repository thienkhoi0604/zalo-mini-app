import React, { FC } from "react";

interface OpenStatusBadgeProps {
  openingHours?: string;
}

interface CapacityBadgeProps {
  capacity?: string;
}

export const OpenStatusBadge: FC<OpenStatusBadgeProps> = ({ openingHours }) => {
  if (!openingHours) return null;

  return (
    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
      Mở cửa
    </span>
  );
};

export const CapacityBadge: FC<CapacityBadgeProps> = ({ capacity }) => {
  if (!capacity) return null;

  return (
    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
      {capacity}
    </span>
  );
};

interface ChargerCountProps {
  count?: number;
}

export const ChargerCountMetric: FC<ChargerCountProps> = ({ count }) => {
  if (count === undefined) return null;

  return (
    <span className="text-sm font-semibold text-orange-600">
      {count} máy sạc
    </span>
  );
};
