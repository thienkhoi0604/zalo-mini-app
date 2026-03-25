import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { Gift } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useRewardsStore } from 'stores/rewards';
import VoucherCard from './voucher-card';

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
      boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
    }}
  >
    {label}{' '}
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? '#EEF7F1' : '#E5E7EB',
        color: active ? '#288F4E' : '#9CA3AF',
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 700,
        minWidth: 20,
        height: 18,
        padding: '0 5px',
        marginLeft: 4,
      }}
    >
      {count}
    </span>
  </button>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: FC<{ used: boolean }> = ({ used }) => (
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
      {used
        ? 'Bạn chưa sử dụng voucher nào'
        : 'Bạn chưa có voucher nào\nHãy đổi điểm để nhận voucher!'}
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

// ─── My Vouchers Page ─────────────────────────────────────────────────────────

const MyVouchersPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('unused');
  const navigate = useNavigate();
  const {
    userRewards,
    allRewards,
    loading,
    loadUserRewards,
    loadAllRewards,
  } = useRewardsStore();

  useEffect(() => {
    loadUserRewards();
    if (allRewards.length === 0) {
      loadAllRewards();
    }
  }, []);

  const unusedVouchers = userRewards.filter((v) => v.status === 'received');
  const usedVouchers = userRewards.filter((v) => v.status === 'redeemed');
  const activeVouchers = activeTab === 'unused' ? unusedVouchers : usedVouchers;

  const getReward = (rewardId: string) =>
    allRewards.find((c) => c.id === rewardId);

  return (
    <Page className="flex-1 flex flex-col overflow-hidden">
      {/* Title */}
      <Box className="px-4 pt-1 pb-3">
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
          Voucher của tôi
        </p>
      </Box>

      {/* Tabs */}
      <Box
        className="mx-4 mb-3 flex"
        style={{
          background: '#EEF7F1',
          borderRadius: 100,
          padding: 3,
          gap: 2,
        }}
      >
        <TabButton
          label="Chưa dùng"
          count={unusedVouchers.length}
          active={activeTab === 'unused'}
          onClick={() => setActiveTab('unused')}
        />
        <TabButton
          label="Đã dùng"
          count={usedVouchers.length}
          active={activeTab === 'used'}
          onClick={() => setActiveTab('used')}
        />
      </Box>

      {/* List */}
      <Box className="flex-1 overflow-y-auto px-4 pb-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <>
            <VoucherSkeleton />
            <VoucherSkeleton />
            <VoucherSkeleton />
          </>
        ) : activeVouchers.length === 0 ? (
          <EmptyState used={activeTab === 'used'} />
        ) : (
          activeVouchers.map((uv) => {
            const card = getReward(uv.rewardId);
            if (!card) return null;
            return (
              <VoucherCard
                key={uv.id}
                reward={card}
                userVoucher={uv}
                used={activeTab === 'used'}
                onClick={() => navigate(`/rewards/${card.id}`, { state: { owned: true } })}
              />
            );
          })
        )}
      </Box>


    </Page>
  );
};

export default MyVouchersPage;
