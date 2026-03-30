import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { useStationsStore } from '@/store/stations';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import StationCard from './station-card';
import SearchFilter from './search-filter';
import PullToRefresh from '@/components/ui/pull-to-refresh';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StationSkeleton: FC = () => (
  <Box
    className="bg-white rounded-2xl overflow-hidden animate-pulse"
    style={{ marginBottom: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}
  >
    <Box style={{ height: 140, background: '#E9EBED' }} />
    <Box style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box style={{ height: 12, width: '80%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ display: 'flex', gap: 6 }}>
        <Box style={{ height: 22, width: 70, background: '#E9EBED', borderRadius: 20 }} />
        <Box style={{ height: 22, width: 90, background: '#E9EBED', borderRadius: 20 }} />
      </Box>
    </Box>
  </Box>
);

// ─── Loading more ──────────────────────────────────────────────────────────────

const LoadingMore: FC = () => (
  <Box flex className="justify-center items-center py-4" style={{ gap: 8 }}>
    <Box
      className="rounded-full animate-spin"
      style={{ width: 18, height: 18, border: '2px solid #E5E7EB', borderTopColor: '#288F4E' }}
    />
    <p style={{ fontSize: 13, color: '#9CA3AF' }}>Đang tải thêm...</p>
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const StationsPage: FC = () => {
  const navigate = useNavigate();
  const { stations, loading, hasMore, loadStations, loadMore, search, provinceCode, wardCode } = useStationsStore();

  useEffect(() => { loadStations(); }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);
  const isInitialLoad = loading && stations.length === 0;
  const hasActiveFilters = search || provinceCode || wardCode;

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F6F8F6' }}>
      <PullToRefresh onRefresh={loadStations} className="flex-1">

        {/* Search & filters */}
        <SearchFilter />

        {/* List */}
        <Box className="px-4 pt-4 pb-4">
          {isInitialLoad ? (
            <>
              <StationSkeleton />
              <StationSkeleton />
              <StationSkeleton />
              <StationSkeleton />
            </>
          ) : stations.length === 0 ? (
            <Box className="flex flex-col items-center justify-center py-20" style={{ gap: 12 }}>
              <Box
                className="flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, background: '#EEF7F1' }}
              >
                <Zap size={32} color="#288F4E" fill="#288F4E" strokeWidth={0} />
              </Box>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>
                {hasActiveFilters ? 'Không tìm thấy trạm sạc' : 'Chưa có trạm sạc'}
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
                {hasActiveFilters
                  ? 'Thử thay đổi bộ lọc để tìm kết quả khác'
                  : 'Hiện chưa có trạm sạc nào trong khu vực'}
              </p>
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
              {loading && stations.length > 0 && <LoadingMore />}
              <div ref={sentinelRef} style={{ height: 1 }} />
              {!hasMore && stations.length > 0 && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB', padding: '12px 0' }}>
                  Đã hiển thị tất cả trạm sạc
                </p>
              )}
            </>
          )}
        </Box>

      </PullToRefresh>
    </Page>
  );
};

export default StationsPage;
