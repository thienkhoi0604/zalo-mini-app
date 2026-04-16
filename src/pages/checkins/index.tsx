import React, { FC, useEffect, useRef, useState } from 'react';
import { Page } from 'zmp-ui';
import { PointTransaction } from '@/types/point-transaction';
import { getPointTransactions } from '@/api/user';
import PointTransactionTab, { Tab } from './point-transaction-tab';
import PullToRefresh from '@/components/ui/pull-to-refresh';

const GREENCOIN_TYPE = 7;

// ─── Page ─────────────────────────────────────────────────────────────────────

const CheckinHistoryPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leaf');
  const [leafData, setLeafData] = useState<PointTransaction[]>([]);
  const [greenCoinData, setGreenCoinData] = useState<PointTransaction[]>([]);
  const [leafLoading, setLeafLoading] = useState(true);
  const [greenCoinLoading, setGreenCoinLoading] = useState(false);
  const greenCoinFetchedRef = useRef(false);

  const loadLeaf = async () => {
    setLeafLoading(true);
    const all = await getPointTransactions();
    setLeafData(all.filter((t) => t.type === 'Earn' || t.type === 'Spend'));
    setLeafLoading(false);
  };

  const loadGreenCoin = async () => {
    setGreenCoinLoading(true);
    const data = await getPointTransactions(GREENCOIN_TYPE);
    setGreenCoinData(data);
    setGreenCoinLoading(false);
  };

  useEffect(() => { loadLeaf(); }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'greencoin' && !greenCoinFetchedRef.current) {
      greenCoinFetchedRef.current = true;
      loadGreenCoin();
    }
  };

  const handleRefresh = async () => {
    if (activeTab === 'leaf') await loadLeaf();
    else await loadGreenCoin();
  };

  const transactions = activeTab === 'leaf' ? leafData : greenCoinData;
  const loading = activeTab === 'leaf' ? leafLoading : greenCoinLoading;

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1 px-4 pt-4 pb-8"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <PointTransactionTab
          transactions={transactions}
          type={activeTab}
          onTypeChange={handleTabChange}
          loading={loading}
        />
      </PullToRefresh>
    </Page>
  );
};

export default CheckinHistoryPage;
