import React, { FC, useEffect, useMemo, useState } from 'react';
import { Page } from 'zmp-ui';
import { PointTransaction } from '@/types/point-transaction';
import { getPointTransactions } from '@/api/user';
import HistorySkeleton from './history-skeleton';
import PointTransactionTab from './point-transaction-tab';
import PullToRefresh from '@/components/ui/pull-to-refresh';

type Tab = 'earn' | 'spend';

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
        {loading
          ? <HistorySkeleton />
          : <PointTransactionTab transactions={filtered} type={activeTab} onTypeChange={setActiveTab} />
        }
      </PullToRefresh>
    </Page>
  );
};

export default CheckinHistoryPage;
