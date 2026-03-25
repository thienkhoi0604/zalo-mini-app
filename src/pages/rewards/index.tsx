import React, { FC, useEffect, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { useRewardsStore } from 'stores/rewards';
import { useUserStore } from 'stores/user';
import RewardsList from './item-cards-list';

const SkeletonRow: FC = () => (
  <Box className="mb-1">
    <Box flex className="items-center justify-between px-4 mb-3">
      <Box
        className="rounded"
        style={{ height: 16, width: 120, background: '#E5E7EB' }}
      />
      <Box
        className="rounded"
        style={{ height: 12, width: 60, background: '#E5E7EB' }}
      />
    </Box>
    <Box
      flex
      style={{ gap: 10, paddingLeft: 16, paddingRight: 16, overflow: 'hidden' }}
    >
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          className="flex-shrink-0 rounded-2xl"
          style={{ width: 140, height: 155, background: '#E5E7EB' }}
        />
      ))}
    </Box>
  </Box>
);

const RewardsPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const { loading, loadAllRewards, loadUserRewards } = useRewardsStore();
  const { user } = useUserStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAllRewards();
        await loadUserRewards();
        setInitialized(true);
      } catch {
        openSnackbar({
          text: 'Không thể tải danh sách phần thưởng',
          type: 'error',
        });
        setInitialized(true);
      }
    };
    initializeData();
  }, []);

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      {/* Summary bar */}
      <Box
        className="mx-4 mt-3 mb-4 rounded-2xl bg-white shadow-sm"
        flex
      >
        <Box
          className="flex-1 text-center py-3"
          style={{ borderRight: '1px solid #F3F3F3' }}
        >
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
            VPoint khả dụng
          </p>
          <Box flex className="justify-center items-center" style={{ gap: 5 }}>
            <span style={{ fontSize: 18 }}>🪙</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
              {user?.points || 0}
            </p>
          </Box>
        </Box>
        <Box className="flex-1 text-center py-3">
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
            Voucher của bạn
          </p>
          <Box flex className="justify-center items-center" style={{ gap: 5 }}>
            <span style={{ fontSize: 18 }}>🎫</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
              {user?.voucherCount || 0}
            </p>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box className="flex-1 pb-6">
        {!initialized && loading ? (
          <Box className="flex flex-col" style={{ gap: 20 }}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </Box>
        ) : (
          <RewardsList />
        )}
      </Box>
    </Page>
  );
};

export default RewardsPage;
