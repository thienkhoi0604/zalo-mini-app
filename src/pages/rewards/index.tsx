import React, { FC, useEffect, useState } from 'react';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { Gift, Ticket, ChevronRight } from 'lucide-react';
import { useRewardsStore } from '@/stores/rewards';
import { useUserStore } from '@/stores/user';
import RewardsList from './item-cards-list';
import { useNavigate } from 'react-router';
import PullToRefresh from '@/components/pull-to-refresh';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonRow: FC = () => (
  <Box style={{ paddingBottom: 4 }}>
    <Box flex className="items-center justify-between px-4 mb-3">
      <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Box style={{ width: 4, height: 20, background: '#E9EBED', borderRadius: 2 }} />
        <Box className="rounded" style={{ height: 15, width: 100, background: '#E9EBED' }} />
        <Box className="rounded-full" style={{ height: 20, width: 28, background: '#E9EBED' }} />
      </Box>
      <Box className="rounded" style={{ height: 13, width: 60, background: '#E9EBED' }} />
    </Box>
    <Box flex style={{ gap: 10, paddingLeft: 16, paddingRight: 16, overflow: 'hidden' }}>
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          className="flex-shrink-0 rounded-2xl animate-pulse"
          style={{ width: 148, height: 158, background: '#E9EBED' }}
        />
      ))}
    </Box>
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RewardsPage: FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const { loading, loadAllRewards, loadUserRewards, userRewards } = useRewardsStore();
  const { pointWallet, isAuthenticated } = useUserStore();

  useEffect(() => {
    const init = async () => {
      try {
        await loadAllRewards();
        if (isAuthenticated) await loadUserRewards();
        setInitialized(true);
      } catch {
        openSnackbar({ text: 'Không thể tải danh sách phần thưởng', type: 'error' });
        setInitialized(true);
      }
    };
    init();
  }, [isAuthenticated]);

  return (
    <Page className="flex-1 flex flex-col" style={{ background: '#F5F5F7' }}>

      {/* Stats banner */}
      {isAuthenticated && (
        <Box
          style={{
            background: 'linear-gradient(135deg, #2FA85F 0%, #1A6B38 100%)',
            padding: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <Box
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />

          <Box flex style={{ gap: 0 }}>
            {/* Coins */}
            <Box
              className="flex-1 text-center"
              style={{ borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: 12 }}
            >
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 5 }}>
                Xu khả dụng
              </p>
              <Box flex className="justify-center items-center" style={{ gap: 5 }}>
                <span style={{ fontSize: 18 }}>🪙</span>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                </p>
              </Box>
            </Box>

            {/* Vouchers */}
            <Box
              className="flex-1 text-center cursor-pointer"
              style={{ paddingLeft: 12 }}
              onClick={() => navigate('/my-vouchers')}
            >
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 5 }}>
                Voucher của bạn
              </p>
              <Box flex className="justify-center items-center" style={{ gap: 5 }}>
                <Ticket size={18} color="#fff" />
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  {userRewards.filter((v) => v.usedAt === null).length}
                </p>
                <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Rewards list */}
      <PullToRefresh
        onRefresh={async () => {
          await loadAllRewards();
          if (isAuthenticated) await loadUserRewards();
        }}
        className="flex-1 py-5"
      >
        {!initialized && loading ? (
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </Box>
        ) : (
          <RewardsList />
        )}
      </PullToRefresh>
    </Page>
  );
};

export default RewardsPage;
