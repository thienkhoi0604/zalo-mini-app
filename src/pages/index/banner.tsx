import React, { FC } from "react";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";

const getDummyImage = (filename: string) =>
  `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/${filename}`;

export const Banner: FC = () => {
  return (
    <Box className="px-4 pt-1 pb-2">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        cssMode
        style={
          {
            '--swiper-pagination-color': '#288F4E',
            '--swiper-pagination-bullet-inactive-color': '#D1D5DB',
            '--swiper-pagination-bullet-inactive-opacity': '1',
            '--swiper-pagination-bullet-size': '6px',
            '--swiper-pagination-bottom': '8px',
          } as React.CSSProperties
        }
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <SwiperSlide key={i}>
            <Box
              className="w-full rounded-2xl bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `url(${getDummyImage(`banner-${i}.webp`)})`,
                aspectRatio: '2 / 1',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
