import React, { FC, useEffect, useMemo } from 'react';
import { Box, Page } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { useCheckinsStore } from '@/store/checkins';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import HistorySkeleton from './history-skeleton';
import HistoryItem from './history-item';
import SummaryBanner from './summary-banner';
import { groupByDate } from './utils';
import PullToRefresh from '@/components/ui/pull-to-refresh';

const CheckinHistoryPage: FC = () => {
  const { history, historyLoading, hasMore, loadHistory, loadMoreHistory } = useCheckinsStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const sentinelRef = useInfiniteScroll(loadMoreHistory, hasMore, historyLoading);
  const groups = useMemo(() => groupByDate(history), [history]);
  const isInitialLoad = historyLoading && history.length === 0;

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <PullToRefresh
        onRefresh={async () => { await loadHistory(); }}
        className="flex-1 px-4 pt-4 pb-8"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {isInitialLoad ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-16" style={{ gap: 12 }}>
            <Box
              className="flex items-center justify-center rounded-full"
              style={{ width: 72, height: 72, background: '#EEF7F1' }}
            >
              <Zap size={32} color="#288F4E" fill="#288F4E" strokeWidth={0} />
            </Box>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Chưa có lịch sử</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
              Hãy check-in tại trạm sạc để bắt đầu tích điểm nhé!
            </p>
          </Box>
        ) : (
          <>
            <SummaryBanner history={history} />

            <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {groups.map((group) => (
                <Box key={group.label}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 8,
                      paddingLeft: 4,
                    }}
                  >
                    {group.label}
                  </p>
                  <Box
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}
                  >
                    {group.items.map((item, idx) => (
                      <HistoryItem key={item.id} item={item} isLast={idx === group.items.length - 1} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            {historyLoading && (
              <Box flex className="justify-center items-center py-2" style={{ gap: 8 }}>
                <Box
                  className="rounded-full animate-spin"
                  style={{ width: 18, height: 18, border: '2px solid #E5E7EB', borderTopColor: '#288F4E' }}
                />
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>Đang tải thêm...</p>
              </Box>
            )}

            <div ref={sentinelRef} style={{ height: 1 }} />

            {!hasMore && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB' }}>
                Đã hiển thị toàn bộ lịch sử
              </p>
            )}
          </>
        )}
      </PullToRefresh>
    </Page>
  );
};

export default CheckinHistoryPage;
