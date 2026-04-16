import React, { FC, useMemo } from 'react';
import { Box } from 'zmp-ui';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { PointTransaction } from '@/types/point-transaction';
import { useUserStore } from '@/store/user';
import CoinIcon from '@/components/ui/coin-icon';
import PointTransactionItem from './point-transaction-item';
import HistorySkeleton from './history-skeleton';
import { groupByDateField } from './utils';

type Tab = 'earn' | 'spend' | 'greencoin';

// ─── Summary banner ────────────────────────────────────────────────────────────

const TransactionSummary: FC<{ transactions: PointTransaction[]; type: Tab; onTypeChange: (t: Tab) => void }> = ({ transactions, type, onTypeChange }) => {
  const total = transactions.reduce((sum, t) => sum + t.points, 0);
  const { pointWallet } = useUserStore();

  const label = type === 'earn' ? 'Tổng tích lũy' : type === 'spend' ? 'Tổng đã dùng' : 'Tổng GreenCoin';
  const subLabel = type === 'earn' ? 'lần tích điểm' : type === 'spend' ? 'lần sử dụng' : 'giao dịch';
  const balance = type === 'greencoin' ? (pointWallet?.greenCoin ?? 0) : (pointWallet?.currentBalance ?? 0);
  const balanceLabel = type === 'greencoin' ? 'GreenCoin hiện có' : 'Số dư hiện tại';

  return (
    <Box
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)', padding: '16px 20px' }}
    >
      <Box flex className="items-center" style={{ marginBottom: 12 }}>
        <Box style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {total.toLocaleString('vi-VN')}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Từ {transactions.length} {subLabel}
          </p>
        </Box>

        {/* Toggle buttons */}
        <Box flex className="flex-shrink-0" style={{ gap: 8 }}>
          {([
            {
              key: 'earn' as Tab,
              icon: (active: boolean) => <TrendingUp size={20} color={active ? '#288F4E' : 'rgba(255,255,255,0.5)'} strokeWidth={2.5} />,
            },
            {
              key: 'spend' as Tab,
              icon: (active: boolean) => <TrendingDown size={20} color={active ? '#288F4E' : 'rgba(255,255,255,0.5)'} strokeWidth={2.5} />,
            },
            {
              key: 'greencoin' as Tab,
              icon: (active: boolean) => <CoinIcon size={14} style={{ opacity: active ? 1 : 0.45, filter: active ? 'none' : 'grayscale(0.4)' }} />,
            },
          ] as { key: Tab; icon: (active: boolean) => React.ReactNode }[]).map(({ key, icon }) => {
            const isActive = type === key;
            return (
              <Box
                key={key}
                onClick={() => onTypeChange(key)}
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isActive ? '#fff' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {icon(isActive)}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

      <Box flex className="items-center justify-between">
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{balanceLabel}</p>
        <Box flex className="items-center" style={{ gap: 5 }}>
          <CoinIcon size={20} />
          <p style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
            {balance.toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Tab content ──────────────────────────────────────────────────────────────

const PointTransactionTab: FC<{
  transactions: PointTransaction[];
  type: Tab;
  onTypeChange: (t: Tab) => void;
  loading?: boolean;
}> = ({ transactions, type, onTypeChange, loading = false }) => {
  const groups = useMemo(() => groupByDateField(transactions, (t) => t.createdAt), [transactions]);

  const emptyIcon = type === 'earn'
    ? <TrendingUp size={32} color="#288F4E" strokeWidth={2} />
    : type === 'spend'
    ? <TrendingDown size={32} color="#288F4E" strokeWidth={2} />
    : <CoinIcon size={24} />;

  const emptyMessage = type === 'earn'
    ? 'Hãy check-in tại trạm sạc để bắt đầu tích điểm nhé!'
    : type === 'spend'
    ? 'Bạn chưa sử dụng điểm nào.'
    : 'Chưa có giao dịch GreenCoin nào.';

  const listContent = () => {
    if (loading) return <HistorySkeleton />;
    if (transactions.length === 0) {
      return (
        <Box className="flex flex-col items-center justify-center py-16" style={{ gap: 12 }}>
          <Box
            className="flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, background: '#EEF7F1' }}
          >
            {emptyIcon}
          </Box>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Chưa có lịch sử</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>{emptyMessage}</p>
        </Box>
      );
    }
    return (
      <>
        {groups.map((group) => (
          <Box key={group.label}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {group.label}
            </p>
            <Box
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}
            >
              {group.items.map((item, idx) => (
                <PointTransactionItem
                  key={item.id}
                  item={item}
                  isLast={idx === group.items.length - 1}
                />
              ))}
            </Box>
          </Box>
        ))}
      </>
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TransactionSummary transactions={transactions} type={type} onTypeChange={onTypeChange} />
      {listContent()}
    </Box>
  );
};

export default PointTransactionTab;
