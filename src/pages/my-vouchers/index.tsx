import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page } from 'zmp-ui';
import { Gift } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import VoucherCard from './voucher-card';
import PullToRefresh from '@/components/ui/pull-to-refresh';

// ─── Tab ─────────────────────────────────────────────────────────────────────

type Tab = 'unused' | 'used';

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '8px 0',
      fontSize: 13,
      fontWeight: 600,
      borderRadius: 100,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: active ? '#fff' : 'transparent',
      color: active ? '#288F4E' : '#767A7F',
      boxShadow: active ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }}
  >
    {label}
    {count > 0 && (
      <span
        style={{
          background: active ? '#288F4E' : '#D1D5DB',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          padding: '1px 6px',
          borderRadius: 100,
          lineHeight: '14px',
        }}
      >
        {count}
      </span>
    )}
  </button>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: FC<{ tab: Tab }> = ({ tab }) => (
  <Box
    className="flex flex-col items-center justify-center"
    style={{ paddingTop: 60, paddingBottom: 40, gap: 14 }}
  >
    <Box
      className="flex items-center justify-center rounded-full"
      style={{
        width: 80,
        height: 80,
        background: 'linear-gradient(145deg, #DCFCE7, #BBF7D0)',
        boxShadow: '0 4px 16px rgba(40,143,78,0.15)',
      }}
    >
      <Gift size={38} color="#288F4E" strokeWidth={1.6} />
    </Box>
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', textAlign: 'center' }}>
        {tab === 'used' ? 'Chưa có voucher đã dùng' : 'Chưa có voucher nào'}
      </p>
      <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: '20px' }}>
        {tab === 'used'
          ? 'Các voucher bạn đã sử dụng sẽ hiển thị ở đây'
          : 'Hãy đổi GreenCoin để nhận voucher ưu đãi!'}
      </p>
    </Box>
  </Box>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const VoucherSkeleton: FC = () => (
  <Box
    style={{
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      height: 96,
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      border: '1px solid #F3F4F6',
    }}
  >
    <Box style={{ width: 76, background: '#E9EBED' }} className="animate-pulse" />
    <Box style={{ width: 14 }} />
    <Box style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box style={{ width: 60, height: 16, background: '#E9EBED', borderRadius: 8 }} className="animate-pulse" />
      <Box style={{ width: '75%', height: 13, background: '#E9EBED', borderRadius: 6 }} className="animate-pulse" />
      <Box style={{ width: '45%', height: 11, background: '#E9EBED', borderRadius: 6 }} className="animate-pulse" />
      <Box style={{ width: 68, height: 18, background: '#E9EBED', borderRadius: 5 }} className="animate-pulse" />
    </Box>
  </Box>
);

const LoadingMore: FC = () => (
  <Box flex className="justify-center items-center py-4" style={{ gap: 8 }}>
    <Box
      className="rounded-full animate-spin"
      style={{ width: 18, height: 18, border: '2px solid #E5E7EB', borderTopColor: '#288F4E' }}
    />
    <p style={{ fontSize: 13, color: '#9CA3AF' }}>Đang tải thêm...</p>
  </Box>
);

// ─── My Vouchers Page ─────────────────────────────────────────────────────────

const MyVouchersPage: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<Tab>('unused');
  const {
    unusedVouchers, unusedVouchersHasMore,
    usedVouchers, usedVouchersHasMore,
    userVouchersLoading: loading,
    loadUserVouchers, loadMoreUserVouchers,
  } = useVouchersStore();

  const isUsed = activeTab === 'used';
  const activeVouchers = isUsed ? usedVouchers : unusedVouchers;
  const activeHasMore = isUsed ? usedVouchersHasMore : unusedVouchersHasMore;

  useEffect(() => {
    loadUserVouchers(false);
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const tabIsUsed = tab === 'used';
    const alreadyLoaded = tabIsUsed ? usedVouchers.length > 0 : unusedVouchers.length > 0;
    if (!alreadyLoaded) loadUserVouchers(tabIsUsed);
  };

  const sentinelRef = useInfiniteScroll(() => loadMoreUserVouchers(isUsed), activeHasMore, loading);

  const isInitialLoad = loading && activeVouchers.length === 0;
  const isLoadingMore = loading && activeVouchers.length > 0;

  return (
    <Page className="flex-1 flex flex-col overflow-hidden">
      <PullToRefresh onRefresh={() => loadUserVouchers(isUsed)} className="flex-1">

        {/* Tabs */}
        <Box className="px-4 pt-3 pb-3">
          <Box
            className="flex"
            style={{ background: '#EEF7F1', borderRadius: 100, padding: 3, gap: 2 }}
          >
            <TabButton
              label="Chưa dùng"
              count={unusedVouchers.length}
              active={activeTab === 'unused'}
              onClick={() => handleTabChange('unused')}
            />
            <TabButton
              label="Đã dùng"
              count={usedVouchers.length}
              active={activeTab === 'used'}
              onClick={() => handleTabChange('used')}
            />
          </Box>
        </Box>

        {/* List */}
        <Box className="px-4 pb-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isInitialLoad ? (
            <>
              <VoucherSkeleton />
              <VoucherSkeleton />
              <VoucherSkeleton />
            </>
          ) : activeVouchers.length === 0 && !loading ? (
            <EmptyState tab={activeTab} />
          ) : (
            <>
              {activeVouchers.map((uv) => (
                <VoucherCard
                  key={uv.id}
                  userVoucher={uv}
                  used={uv.usedAt !== null}
                  onClick={() => navigate(`/my-vouchers/${uv.id}`, { state: { userVoucher: uv } })}
                />
              ))}

              {isLoadingMore && <LoadingMore />}

              <div ref={sentinelRef} style={{ height: 1 }} />

              {!activeHasMore && activeVouchers.length > 0 && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB', padding: '4px 0' }}>
                  Đã hiển thị tất cả voucher
                </p>
              )}
            </>
          )}
        </Box>

      </PullToRefresh>

    </Page>
  );
};

export default MyVouchersPage;
