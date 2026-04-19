import React, { FC, useEffect } from 'react';
import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box } from 'zmp-ui';
import { openWebview } from 'zmp-sdk/apis';
import { useBannersStore } from '@/store/banners';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const BannerSkeleton: FC = () => (
  <Box className="px-4 pt-1 pb-2">
    <Box
      className="animate-pulse rounded-2xl"
      style={{ aspectRatio: '16 / 9', background: '#E9EBED' }}
    />
  </Box>
);

// ─── Banner ───────────────────────────────────────────────────────────────────

export const Banner: FC = () => {
  const { banners, loading, loadBanners } = useBannersStore();

  useEffect(() => {
    loadBanners();
  }, []);

  if (loading && banners.length === 0) return <BannerSkeleton />;
  if (banners.length === 0) return null;

  return (
    <Box className="px-4 pt-1 pb-2">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={banners.length > 1}
        spaceBetween={12}
        speed={400}
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
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              onClick={() => banner.targetUrl && openWebview({ url: banner.targetUrl })}
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                cursor: banner.targetUrl ? 'pointer' : 'default',
              }}
            >
              <img
                src={banner.imageUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
