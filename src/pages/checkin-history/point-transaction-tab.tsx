import React, { FC, useMemo } from 'react';
import { Box } from 'zmp-ui';
import { Zap, TrendingDown } from 'lucide-react';
import { PointTransaction } from '@/types/point-transaction';
import { useUserStore } from '@/store/user';
import CoinIcon from '@/components/ui/coin-icon';
import PointTransactionItem from './point-transaction-item';
import { groupByDateField } from './utils';

type Tab = 'earn' | 'spend';

// ─── Summary banner ────────────────────────────────────────────────────────────

const TransactionSummary: FC<{ transactions: PointTransaction[]; type: Tab }> = ({ transactions, type }) => {
  const total = transactions.reduce((sum, t) => sum + t.points, 0);
  const { pointWallet } = useUserStore();
  const isEarn = type === 'earn';

  return (
    <Box
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #288F4E 0%, #1A6B38 100%)', padding: '16px 20px' }}
    >
      <Box flex className="items-center" style={{ marginBottom: 12 }}>
        <Box style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
            {isEarn ? 'Tổng tích lũy' : 'Tổng đã dùng'}
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {total.toLocaleString('vi-VN')}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Từ {transactions.length} {isEarn ? 'lần tích điểm' : 'lần sử dụng'}
          </p>
        </Box>
        <Box
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', alignSelf: 'center' }}
        >
          {isEarn
            ? <Zap size={28} color="#fff" fill="#fff" strokeWidth={0} />
            : <TrendingDown size={28} color="#fff" strokeWidth={2} />
          }
        </Box>
      </Box>

      <Box style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

      <Box flex className="items-center justify-between">
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Số dư hiện tại</p>
        <Box flex className="items-center" style={{ gap: 5 }}>
          <CoinIcon size={20} />
          <p style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
            {(pointWallet?.currentBalance ?? 0).toLocaleString('vi-VN')}
          </p>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Tab content ──────────────────────────────────────────────────────────────

const PointTransactionTab: FC<{ transactions: PointTransaction[]; type: Tab }> = ({ transactions, type }) => {
  const isEarn = type === 'earn';
  const groups = useMemo(() => groupByDateField(transactions, (t) => t.createdAt), [transactions]);

  if (transactions.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-16" style={{ gap: 12 }}>
        <Box
          className="flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, background: '#EEF7F1' }}
        >
          {isEarn
            ? <Zap size={32} color="#288F4E" fill="#288F4E" strokeWidth={0} />
            : <TrendingDown size={32} color="#288F4E" strokeWidth={2} />
          }
        </Box>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Chưa có lịch sử</p>
        <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
          {isEarn
            ? 'Hãy check-in tại trạm sạc để bắt đầu tích điểm nhé!'
            : 'Bạn chưa sử dụng điểm nào.'
          }
        </p>
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TransactionSummary transactions={transactions} type={type} />

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
    </Box>
  );
};

export default PointTransactionTab;
