import React, { FC, useMemo } from "react";
import { useNavigate } from "react-router";
import { Box, Text } from "zmp-ui";
import { MOCK_STORES } from "mock/stores";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

export const TopStoresCarousel: FC = () => {
  const navigate = useNavigate();

  const topStores = useMemo(
    () =>
      [...MOCK_STORES]
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 5),
    []
  );

  if (topStores.length === 0) {
    return null;
  }

  return (
    <Box className="px-4 pb-4">
      <Box className="flex items-center justify-between mb-3">
        <Text className="font-semibold text-base">Top trạm sạc nổi bật</Text>
        <button
          type="button"
          className="text-xs text-primary"
          onClick={() => navigate("/stores")}
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
        {topStores.map((store) => (
          <SwiperSlide key={store.id}>
            <button
              type="button"
              onClick={() => navigate(`/stores/${store.id}`)}
              className="w-full text-left"
            >
              <Box className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Thumbnail Image */}
                {store.thumbnailImageUrl && (
                  <img
                    src={store.thumbnailImageUrl}
                    alt={store.name}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format";
                    }}
                  />
                )}

                {/* Info */}
                <Box className="p-3 space-y-2">
                  <Box className="flex items-center justify-between gap-2">
                    <Text className="font-semibold text-sm line-clamp-1">
                      {store.name}
                    </Text>
                    {typeof store.points === "number" && (
                      <Box className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <span className="mr-1">⭐</span>
                        <span>{store.points}</span>
                      </Box>
                    )}
                  </Box>
                  <Text className="text-xs text-gray-600 line-clamp-1">
                    {store.address}
                  </Text>
                  {store.chargerCount && (
                    <Text className="text-xs text-blue-600 font-medium">
                      {store.chargerCount} máy sạc · {store.chargingCapacity}
                    </Text>
                  )}
                </Box>
              </Box>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default TopStoresCarousel;

