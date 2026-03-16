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
        <Text className="font-semibold text-base">Top cửa hàng nổi bật</Text>
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
              <Box className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
                <Box className="flex items-center justify-between">
                  <Text className="font-semibold text-sm line-clamp-1">
                    {store.name}
                  </Text>
                  {typeof store.points === "number" && (
                    <Box className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                      <span className="mr-1">⭐</span>
                      <span>{store.points} điểm</span>
                    </Box>
                  )}
                </Box>
                <Text className="text-xs text-gray-600 line-clamp-2">
                  {store.address}
                </Text>
              </Box>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default TopStoresCarousel;

