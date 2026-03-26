import React, { FC, useMemo } from "react";
import { useNavigate } from "react-router";
import { Box, Text } from "zmp-ui";
import { MOCK_STATIONS } from "apis/stations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

export const TopStationsCarousel: FC = () => {
  const navigate = useNavigate();

  const topStations = useMemo(
    () =>
      [...MOCK_STATIONS]
        .sort((a, b) => (b.defaultPoint || 0) - (a.defaultPoint || 0))
        .slice(0, 5),
    []
  );

  if (topStations.length === 0) {
    return null;
  }

  return (
    <Box className="px-4 pb-4">
      <Box className="flex items-center justify-between mb-3">
        <Text className="font-semibold text-base">Top trạm sạc nổi bật</Text>
        <button
          type="button"
          className="text-xs text-primary"
          onClick={() => navigate("/stations")}
        >
          Xem tất cả
        </button>
      </Box>

      <Swiper
        spaceBetween={12}
        slidesPerView={1.15}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {topStations.map((station) => (
          <SwiperSlide key={station.id}>
            <button
              type="button"
              onClick={() => navigate(`/stations/${station.id}`)}
              className="w-full text-left"
            >
              <Box className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <img
                  src={station.imageUrl ?? 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format'}
                  alt={station.name}
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format";
                  }}
                />
                <Box className="p-3 space-y-2">
                  <Box className="flex items-center justify-between gap-2">
                    <Text className="font-semibold text-sm line-clamp-1">{station.name}</Text>
                    {station.defaultPoint != null && (
                      <Box className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <span className="mr-1">⭐</span>
                        <span>{station.defaultPoint}</span>
                      </Box>
                    )}
                  </Box>
                  <Text className="text-xs text-gray-600 line-clamp-1">{station.address}</Text>
                  <Text className="text-xs text-gray-400 line-clamp-1">{station.stationTypeName}</Text>
                </Box>
              </Box>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default TopStationsCarousel;
