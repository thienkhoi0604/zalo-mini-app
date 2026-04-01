import React, { FC, useEffect } from 'react';
import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box } from 'zmp-ui';
// import { openWebview } from 'zmp-sdk/apis'; // TODO: enable when openWebview feature is ready
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

  // TODO: enable openWebview when feature is ready
  const handleTap = (_targetUrl: string | null) => {
    // if (!_targetUrl) return;
    // openWebview({ url: _targetUrl }).catch(() => {});
  };

  return (
    <Box className="px-4 pt-1 pb-2">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={banners.length > 1}
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
            <Box
              onClick={() => handleTap(banner.targetUrl)}
              className="w-full rounded-2xl bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
                aspectRatio: '16 / 9',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                cursor: 'default', // TODO: restore 'pointer' when openWebview feature is ready
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
