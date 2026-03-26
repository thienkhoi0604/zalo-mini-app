import React, { FC } from "react";
import { Box } from "zmp-ui";
import { MapPin, ChevronRight } from "lucide-react";
import type { Station } from "types/station";

interface Props {
  station: Station;
  onClick: () => void;
}

const StationCard: FC<Props> = ({ station, onClick }) => {
  const location = [station.address, station.provinceName].filter(Boolean).join(', ');

  return (
    <Box
      className="flex mb-3 rounded-xl overflow-hidden bg-white shadow-sm"
      style={{ border: "1px solid #f0f0f0" }}
    >
      {/* Image — left side */}
      <div className="flex-shrink-0" style={{ width: 120 }}>
        <img
          src={station.imageUrl ?? undefined}
          alt={station.name}
          style={{ width: 120, height: "100%", minHeight: 120, objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80&auto=format";
          }}
        />
      </div>

      {/* Info — right side */}
      <Box className="flex-1 flex flex-col p-3" style={{ minWidth: 0 }}>
        {/* Station name */}
        <p className="font-semibold text-gray-900 mb-2 leading-snug" style={{ fontSize: 14 }}>
          {station.name}
        </p>

        {/* Type */}
        <p className="text-gray-400 mb-1" style={{ fontSize: 11 }}>
          {station.stationTypeName}
        </p>

        {/* Address */}
        <div className="flex items-start gap-1 mb-2">
          <MapPin size={13} color="#6b7280" className="flex-shrink-0 mt-0.5" />
          <p className="text-gray-500 line-clamp-2" style={{ fontSize: 12 }}>
            {location}
          </p>
        </div>

        {/* Bottom row: points + action button */}
        <div className="flex items-center justify-between mt-auto">
          {station.defaultPoint != null && (
            <span
              className="rounded-full px-2 py-0.5 text-gray-600 font-medium"
              style={{ fontSize: 11, background: "#f3f4f6", border: "1px solid #e5e7eb" }}
            >
              {station.defaultPoint} điểm
            </span>
          )}
          <button
            onClick={onClick}
            className="flex items-center gap-0.5 font-medium rounded-full px-3 py-1 ml-auto"
            style={{ fontSize: 12, background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }}
          >
            Chi tiết
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default StationCard;
