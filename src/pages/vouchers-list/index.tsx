import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page, useSnackbar } from 'zmp-ui';
import CoinIcon from '@/components/ui/coin-icon';
import { useVouchersStore } from '@/store/vouchers';
import { useUserStore } from '@/store/user';
import VouchersList from '@/pages/vouchers/item-cards-list';
import { SkeletonRow } from '@/pages/vouchers';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import PageHeader from '@/components/ui/page-header';
import { ACTIVE_THEME } from '@/constants/theme';

// ─── Page ─────────────────────────────────────────────────────────────────────

const VouchersListPage: FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const { loading, loadAllVouchers, userVouchersUnusedCount, loadUserVouchersCount } = useVouchersStore();
  const { pointWallet, isAuthenticated } = useUserStore();

  useEffect(() => {
    const init = async () => {
      try {
        await loadAllVouchers();
      } catch {
        openSnackbar({ text: 'Không thể tải danh sách voucher', type: 'error' });
      } finally {
        setInitialized(true);
      }
      if (isAuthenticated) loadUserVouchersCount();
    };
    init();
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    const tasks: Promise<void>[] = [loadAllVouchers()];
    if (isAuthenticated) tasks.push(loadUserVouchersCount());
    await Promise.all(tasks);
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ background: ACTIVE_THEME.pageBg }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">

        {/* ── Header ── */}
        <PageHeader paddingBottom={6}>
          {isAuthenticated && (
            <Box
              flex
              className="items-center justify-center"
              style={{
                gap: 8, marginBottom: 12,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 14,
                padding: '8px 14px',
              }}
            >
              <Box flex className="items-center" style={{ gap: 6, flex: 1, justifyContent: 'center' }}>
                <CoinIcon size={18} />
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>
                  {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                </p>
              </Box>

              <Box style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.25)', borderRadius: 1, flexShrink: 0 }} />

              <Box
                onClick={() => navigate('/my-vouchers')}
                flex
                className="items-center"
                style={{ gap: 6, flex: 1, justifyContent: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 13 }}>🎫</span>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>
                  {userVouchersUnusedCount}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>voucher</p>
              </Box>
            </Box>
          )}
        </PageHeader>

        {/* ── Content ── */}
        {!initialized && loading ? (
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </Box>
        ) : (
          <div className="py-3">
            <VouchersList />
          </div>
        )}

      </PullToRefresh>
    </Page>
  );
};

export default VouchersListPage;
