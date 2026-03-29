import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { useStationsStore } from '@/stores/stations';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import StationCard from './station-card';
import SearchFilter from './search-filter';
import PullToRefresh from '@/components/pull-to-refresh';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StationSkeleton: FC = () => (
  <Box
    className="bg-white rounded-2xl overflow-hidden animate-pulse"
    style={{ height: 110, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
  >
    <Box flex style={{ height: '100%' }}>
      <Box style={{ width: 110, background: '#E9EBED', flexShrink: 0 }} />
      <Box className="flex-1 p-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box style={{ width: '70%', height: 13, background: '#E9EBED', borderRadius: 6 }} />
          <Box style={{ width: '40%', height: 11, background: '#E9EBED', borderRadius: 6 }} />
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box style={{ width: '85%', height: 11, background: '#E9EBED', borderRadius: 6 }} />
          <Box style={{ width: '35%', height: 20, background: '#E9EBED', borderRadius: 8 }} />
        </Box>
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
    <Page className="flex-1 flex flex-col">
      <PullToRefresh onRefresh={loadStations} className="flex-1">

        {/* Sub-header */}
        <Box
          className="bg-white px-4 py-3"
          style={{ borderBottom: '1px solid #F0F0F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <Box flex className="items-center" style={{ gap: 6 }}>
            <Box
              className="flex items-center justify-center rounded-full"
              style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #43B96B, #288F4E)' }}
            >
              <Zap size={14} color="#fff" fill="#fff" strokeWidth={0} />
            </Box>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Danh sách trạm sạc</p>
          </Box>
        </Box>

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
