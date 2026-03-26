import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { useStationsStore } from '@/stores/stations';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import StationCard from './stations/station-card';

const StationSkeleton: FC = () => (
  <Box
    className="bg-white rounded-2xl overflow-hidden animate-pulse"
    style={{ height: 96, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 12 }}
  >
    <Box flex style={{ height: '100%' }}>
      <Box style={{ width: 96, background: '#E9EBED', flexShrink: 0 }} />
      <Box className="flex-1 p-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box style={{ width: '65%', height: 14, background: '#E9EBED', borderRadius: 6 }} />
        <Box style={{ width: '45%', height: 12, background: '#E9EBED', borderRadius: 6 }} />
        <Box style={{ width: '80%', height: 12, background: '#E9EBED', borderRadius: 6 }} />
      </Box>
    </Box>
  </Box>
);

const LoadingMore: FC = () => (
  <Box flex className="justify-center items-center py-4" style={{ gap: 8 }}>
    <Box
      className="rounded-full animate-spin"
      style={{
        width: 18, height: 18,
        border: '2px solid #E5E7EB',
        borderTopColor: '#288F4E',
      }}
    />
    <p style={{ fontSize: 13, color: '#9CA3AF' }}>Đang tải thêm...</p>
  </Box>
);

export const StationsPage: FC = () => {
  const navigate = useNavigate();
  const { stations, loading, hasMore, loadStations, loadMore } = useStationsStore();

  useEffect(() => {
    loadStations();
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  const isInitialLoad = loading && stations.length === 0;

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <Box className="flex-1 overflow-auto px-4 pt-4 pb-4">
        {isInitialLoad ? (
          <>
            <StationSkeleton />
            <StationSkeleton />
            <StationSkeleton />
            <StationSkeleton />
          </>
        ) : stations.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-16" style={{ gap: 12 }}>
            <Box
              className="flex items-center justify-center rounded-full"
              style={{ width: 72, height: 72, background: '#EEF7F1' }}
            >
              <Zap size={32} color="#288F4E" fill="#288F4E" strokeWidth={0} />
            </Box>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Chưa có trạm sạc</p>
          </Box>
        ) : (
          <>
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onClick={() => navigate(`/stations/${station.id}`)}
              />
            ))}

            {/* Loading more indicator */}
            {loading && stations.length > 0 && <LoadingMore />}

            {/* Sentinel — triggers loadMore when visible */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {/* End of list */}
            {!hasMore && stations.length > 0 && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB', padding: '12px 0' }}>
                Đã hiển thị tất cả trạm sạc
              </p>
            )}
          </>
        )}
      </Box>
    </Page>
  );
};

export default StationsPage;
