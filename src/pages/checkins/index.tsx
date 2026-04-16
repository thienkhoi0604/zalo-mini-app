import React, { FC, useEffect, useRef, useState } from 'react';
import { Page } from 'zmp-ui';
import { PointTransaction } from '@/types/point-transaction';
import { getPointTransactions } from '@/api/user';
import PointTransactionTab from './point-transaction-tab';
import PullToRefresh from '@/components/ui/pull-to-refresh';

type Tab = 'lá' | 'greencoin';

const GREENCOIN_TYPE = 7;

// ─── Page ─────────────────────────────────────────────────────────────────────

const CheckinHistoryPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('lá');
  const [láData, setLáData] = useState<PointTransaction[]>([]);
  const [greenCoinData, setGreenCoinData] = useState<PointTransaction[]>([]);
  const [láLoading, setLáLoading] = useState(true);
  const [greenCoinLoading, setGreenCoinLoading] = useState(false);
  const greenCoinFetchedRef = useRef(false);

  const loadLá = async () => {
    setLáLoading(true);
    const all = await getPointTransactions();
    setLáData(all.filter((t) => t.type === 'Earn' || t.type === 'Spend'));
    setLáLoading(false);
  };

  const loadGreenCoin = async () => {
    setGreenCoinLoading(true);
    const data = await getPointTransactions(GREENCOIN_TYPE);
    setGreenCoinData(data);
    setGreenCoinLoading(false);
  };

  useEffect(() => { loadLá(); }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'greencoin' && !greenCoinFetchedRef.current) {
      greenCoinFetchedRef.current = true;
      loadGreenCoin();
    }
  };

  const handleRefresh = async () => {
    if (activeTab === 'lá') await loadLá();
    else await loadGreenCoin();
  };

  const transactions = activeTab === 'lá' ? láData : greenCoinData;
  const loading = activeTab === 'lá' ? láLoading : greenCoinLoading;

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
