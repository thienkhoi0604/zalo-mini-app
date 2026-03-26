import React, { FC, useEffect, useMemo } from 'react';
import { Box, Page } from 'zmp-ui';
import { Zap } from 'lucide-react';
import { useCheckinsStore } from '@/stores/checkins';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { CheckinHistoryItem } from '@/types/checkin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatGroupLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(d, today)) return 'Hôm nay';
  if (sameDay(d, yesterday)) return 'Hôm qua';

  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function groupByDate(items: CheckinHistoryItem[]): { label: string; items: CheckinHistoryItem[] }[] {
  const map = new Map<string, CheckinHistoryItem[]>();
  for (const item of items) {
    const label = formatGroupLabel(item.checkinAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(item);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const HistorySkeleton: FC = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[1, 2, 3, 4].map((i) => (
      <Box
        key={i}
        className="bg-white rounded-2xl px-4 py-3 animate-pulse"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Box flex className="items-center" style={{ gap: 12 }}>
          <Box className="rounded-full bg-gray-100 flex-shrink-0" style={{ width: 44, height: 44 }} />
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box className="rounded bg-gray-100" style={{ height: 14, width: '60%' }} />
            <Box className="rounded bg-gray-100" style={{ height: 12, width: '40%' }} />
          </Box>
          <Box className="rounded-full bg-gray-100" style={{ width: 56, height: 26 }} />
        </Box>
      </Box>
    ))}
  </Box>
);

// ─── Item ─────────────────────────────────────────────────────────────────────

const HistoryItem: FC<{ item: CheckinHistoryItem; isLast: boolean }> = ({ item, isLast }) => (
  <Box
    flex
    className="items-center"
    style={{
      padding: '12px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
      gap: 12,
    }}
  >
    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #EEF7F1 0%, #D1ECDB 100%)' }}
    >
      <Zap size={20} color="#288F4E" fill="#288F4E" strokeWidth={0} />
    </Box>

    <Box style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#1a1a1a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.stationName}
      </p>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
        {item.stationTypeName} · {formatTime(item.checkinAt)}
      </p>
    </Box>

    <Box
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ background: '#EEF7F1', padding: '4px 10px', minWidth: 56 }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: '#288F4E' }}>+{item.pointEarned}</p>
    </Box>
  </Box>
);

// ─── Summary Banner ────────────────────────────────────────────────────────────

const SummaryBanner: FC<{ history: CheckinHistoryItem[] }> = ({ history }) => {
  const totalPoints = history.reduce((sum, h) => sum + h.pointEarned, 0);
  return (
    <Box
      flex
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)', padding: '16px 20px' }}
    >
      <Box style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Tổng điểm đã tích</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
          {totalPoints.toLocaleString('vi-VN')}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
          điểm từ {history.length} lần check-in
        </p>
      </Box>
      <Box
        className="flex items-center justify-center rounded-2xl flex-shrink-0"
        style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', alignSelf: 'center' }}
      >
        <Zap size={28} color="#fff" fill="#fff" strokeWidth={0} />
      </Box>
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      <Box
        className="flex-1 overflow-auto px-4 pt-4 pb-8"
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

            {/* Loading more */}
            {historyLoading && (
              <Box flex className="justify-center items-center py-2" style={{ gap: 8 }}>
                <Box
                  className="rounded-full animate-spin"
                  style={{ width: 18, height: 18, border: '2px solid #E5E7EB', borderTopColor: '#288F4E' }}
                />
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>Đang tải thêm...</p>
              </Box>
            )}

            {/* Sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {!hasMore && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB' }}>
                Đã hiển thị toàn bộ lịch sử
              </p>
            )}
          </>
        )}
      </Box>
    </Page>
  );
};

export default CheckinHistoryPage;
