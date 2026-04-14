import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { Zap, TrendingDown } from 'lucide-react';
import { PointTransaction } from '@/types/point-transaction';
import { getPointTransactions } from '@/api/user';
import HistorySkeleton from './history-skeleton';
import PointTransactionTab from './point-transaction-tab';
import PullToRefresh from '@/components/ui/pull-to-refresh';

type Tab = 'earn' | 'spend';

// ─── Icon toggle ──────────────────────────────────────────────────────────────

const IconToggle: FC<{ active: Tab; onChange: (t: Tab) => void }> = ({ active, onChange }) => (
  <Box flex className="items-center justify-center" style={{ gap: 10 }}>
    {([
      { key: 'earn' as Tab, icon: (active: boolean) => <Zap size={20} color={active ? '#288F4E' : '#9CA3AF'} fill={active ? '#288F4E' : 'none'} strokeWidth={0} /> },
      { key: 'spend' as Tab, icon: (active: boolean) => <TrendingDown size={20} color={active ? '#288F4E' : '#9CA3AF'} strokeWidth={2.5} /> },
    ]).map(({ key, icon }) => {
      const isActive = active === key;
      return (
        <Box
          key={key}
          onClick={() => onChange(key)}
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: isActive ? '#EEF7F1' : '#F3F4F6',
            border: isActive ? '1.5px solid #A7F3D0' : '1.5px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          {icon(isActive)}
        </Box>
      );
    })}
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CheckinHistoryPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('earn');
  const [all, setAll] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    getPointTransactions()
      .then(setAll)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => all.filter((t) => (activeTab === 'earn' ? t.type === 'Earn' : t.type === 'Spend')),
    [all, activeTab],
  );

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <PullToRefresh
        onRefresh={load}
        className="flex-1 px-4 pt-4 pb-8"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <IconToggle active={activeTab} onChange={setActiveTab} />

        {loading
          ? <HistorySkeleton />
          : <PointTransactionTab transactions={filtered} type={activeTab} />
        }
      </PullToRefresh>
    </Page>
  );
};

export default CheckinHistoryPage;
