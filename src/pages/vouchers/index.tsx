import React, { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Page, useSnackbar } from 'zmp-ui';
import { LayoutGrid, Store } from 'lucide-react';
import CoinIcon from '@/components/ui/coin-icon';
import { useVouchersStore } from '@/store/vouchers';
import { useUserStore } from '@/store/user';
import VouchersList from './item-cards-list';
import StoreTab from './store-feed';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import PageHeader from '@/components/ui/page-header';
import { ACTIVE_THEME } from '@/constants/theme';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonRow: FC = () => (
  <Box style={{ paddingBottom: 4 }}>
    <Box
      className="animate-pulse"
      style={{ margin: '0 12px', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}
    >
      <Box style={{ height: 3, background: '#E9EBED' }} />
      <Box style={{ padding: '13px 14px 11px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Box style={{ width: 38, height: 38, borderRadius: 11, background: '#E9EBED' }} />
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box style={{ height: 13, width: '45%', background: '#E9EBED', borderRadius: 5 }} />
          <Box style={{ height: 10, width: '30%', background: '#E9EBED', borderRadius: 5 }} />
        </Box>
        <Box style={{ height: 30, width: 80, background: '#E9EBED', borderRadius: 20 }} />
      </Box>
      <Box flex style={{ gap: 10, padding: '4px 14px 16px' }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            style={{ width: 160, height: 192, background: '#E9EBED', borderRadius: 18, flexShrink: 0 }}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

// ─── Tab switcher ──────────────────────────────────────────────────────────────

type TabKey = 'category' | 'store';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'category', label: 'Danh mục', icon: <LayoutGrid size={14} strokeWidth={2} /> },
  { key: 'store',    label: 'Cửa hàng', icon: <Store size={14} strokeWidth={2} /> },
];

interface TabSwitcherProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

const TabSwitcher: FC<TabSwitcherProps> = ({ active, onChange }) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ category: null, store: null });

  useEffect(() => {
    const el = tabRefs.current[active];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    indicator.style.width  = `${el.offsetWidth}px`;
    indicator.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [active]);

  return (
    <Box
      style={{
        background: 'rgba(255,255,255,0.14)',
        borderRadius: 16,
        padding: 4,
        display: 'inline-flex',
        position: 'relative',
      }}
    >
      {/* Sliding indicator */}
      <div
        ref={indicatorRef}
        style={{
          position: 'absolute',
          top: 4, left: 4,
          height: 'calc(100% - 8px)',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.16)',
          transition: 'width 0.22s ease, transform 0.22s ease',
          pointerEvents: 'none',
        }}
      />
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[tab.key] = el; }}
            onClick={() => onChange(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 16px',
              background: 'transparent', border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              position: 'relative', zIndex: 1,
              transition: 'color 0.18s',
              color: isActive ? '#1A6B38' : 'rgba(255,255,255,0.78)',
            }}
          >
            {tab.icon}
            <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{tab.label}</p>
          </button>
        );
      })}
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VouchersPage: FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const { loading, loadAllVouchers, loadStoreGroups, userVouchersUnusedCount, loadUserVouchersCount } = useVouchersStore();
  const { pointWallet, isAuthenticated } = useUserStore();

  useEffect(() => {
    const init = async () => {
      try {
        await loadAllVouchers();
        setInitialized(true);
      } catch {
        openSnackbar({ text: 'Không thể tải danh sách voucher', type: 'error' });
        setInitialized(true);
      }
    };
    init();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) loadUserVouchersCount();
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    const tasks: Promise<void>[] = [loadAllVouchers(), loadStoreGroups()];
    if (isAuthenticated) tasks.push(loadUserVouchersCount());
    await Promise.all(tasks);
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ background: ACTIVE_THEME.pageBg }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">

        {/* ── Header ── */}
        <PageHeader paddingBottom={6}>
          {/* Stats bar */}
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
              {/* Points balance */}
              <Box flex className="items-center" style={{ gap: 6, flex: 1, justifyContent: 'center' }}>
                <CoinIcon size={18} />
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>
                  {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>điểm</p>
              </Box>

              {/* Divider */}
              <Box style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.25)', borderRadius: 1, flexShrink: 0 }} />

              {/* Unused vouchers */}
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

          {/* Tab switcher */}
          <Box flex className="justify-center">
            <TabSwitcher active={activeTab} onChange={setActiveTab} />
          </Box>
        </PageHeader>

        {/* ── Content ── */}
        {activeTab === 'category' ? (
          !initialized && loading ? (
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </Box>
          ) : (
            <div className="py-3">
              <VouchersList />
            </div>
          )
        ) : (
          <StoreTab />
        )}

      </PullToRefresh>
    </Page>
  );
};

export default VouchersPage;
