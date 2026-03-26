import React, { FC, useEffect, useState, useRef } from 'react';
import { Box, Page } from 'zmp-ui';
import { Gift } from 'lucide-react';
import { useRewardsStore } from '@/stores/rewards';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import VoucherCard from './voucher-card';
import VoucherDetailSheet from './voucher-detail-sheet';
import { UserReward } from '@/types/reward';

// ─── Tab ─────────────────────────────────────────────────────────────────────

type Tab = 'unused' | 'used';

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({ label, active, onClick }) => (
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
      boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
    }}
  >
    {label}
  </button>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: FC<{ tab: Tab }> = ({ tab }) => (
  <Box
    className="flex flex-col items-center justify-center"
    style={{ paddingTop: 60, paddingBottom: 40, gap: 12 }}
  >
    <Box
      className="flex items-center justify-center rounded-full"
      style={{ width: 72, height: 72, background: '#EEF7F1' }}
    >
      <Gift size={36} color="#288F4E" />
    </Box>
    <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: '20px' }}>
      {tab === 'used' ? 'Bạn chưa sử dụng voucher nào' : 'Bạn chưa có voucher nào\nHãy đổi điểm để nhận voucher!'}
    </p>
  </Box>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const VoucherSkeleton: FC = () => (
  <Box
    className="bg-white rounded-2xl overflow-hidden flex"
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', height: 100 }}
  >
    <Box style={{ width: 90, background: '#E9EBED' }} className="animate-pulse" />
    <Box style={{ width: 16 }} />
    <Box className="flex-1 py-3 pr-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box style={{ width: 64, height: 16, background: '#E9EBED', borderRadius: 8 }} className="animate-pulse" />
      <Box style={{ width: '80%', height: 14, background: '#E9EBED', borderRadius: 6 }} className="animate-pulse" />
      <Box style={{ width: '50%', height: 12, background: '#E9EBED', borderRadius: 6 }} className="animate-pulse" />
      <Box style={{ width: 72, height: 20, background: '#E9EBED', borderRadius: 6 }} className="animate-pulse" />
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
  const [activeTab, setActiveTab] = useState<Tab>('unused');
  const [selectedVoucher, setSelectedVoucher] = useState<UserReward | null>(null);
  const { userRewards, loading, userRewardsHasMore, loadUserRewards, loadMoreUserRewards } = useRewardsStore();

  useEffect(() => {
    loadUserRewards();
  }, []);

  const sentinelRef = useInfiniteScroll(loadMoreUserRewards, userRewardsHasMore, loading);

  const unusedVouchers = userRewards.filter((v) => v.usedAt === null);
  const usedVouchers = userRewards.filter((v) => v.usedAt !== null);
  const activeVouchers = activeTab === 'unused' ? unusedVouchers : usedVouchers;

  const isInitialLoad = loading && userRewards.length === 0;
  const isLoadingMore = loading && userRewards.length > 0;

  return (
    <Page className="flex-1 flex flex-col overflow-hidden">
      <Box className="px-4 pt-1 pb-3" />

      {/* Tabs */}
      <Box
        className="mx-4 mb-3 flex"
        style={{ background: '#EEF7F1', borderRadius: 100, padding: 3, gap: 2 }}
      >
        <TabButton label="Chưa dùng" active={activeTab === 'unused'} onClick={() => setActiveTab('unused')} />
        <TabButton label="Đã dùng" active={activeTab === 'used'} onClick={() => setActiveTab('used')} />
      </Box>

      {/* List */}
      <Box
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
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
                onClick={() => setSelectedVoucher(uv)}
              />
            ))}

            {isLoadingMore && <LoadingMore />}

            {/* Sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {!userRewardsHasMore && activeVouchers.length > 0 && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#D1D5DB', padding: '4px 0' }}>
                Đã hiển thị tất cả voucher
              </p>
            )}
          </>
        )}
      </Box>

      <VoucherDetailSheet userVoucher={selectedVoucher} onClose={() => setSelectedVoucher(null)} />
    </Page>
  );
};

export default MyVouchersPage;
