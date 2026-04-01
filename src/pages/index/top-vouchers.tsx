import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Gift, ChevronRight } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher, getVoucherTypeLabel } from '@/types/voucher';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <Box
    className="flex-shrink-0 bg-white rounded-2xl overflow-hidden animate-pulse"
    style={{ width: 140, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
  >
    <Box style={{ height: 90, background: '#E9EBED' }} />
    <Box className="p-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ height: 10, width: '45%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 12, width: '90%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 12, width: '60%', background: '#E9EBED', borderRadius: 6 }} />
      <Box style={{ height: 18, width: '40%', background: '#E9EBED', borderRadius: 8 }} />
    </Box>
  </Box>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const VoucherCard: FC<{ reward: Voucher; onClick: () => void }> = ({ reward, onClick }) => (
  <Box
    className="flex-shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer"
    style={{ width: 140, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    onClick={onClick}
  >
    {/* Thumbnail */}
    <Box style={{ height: 90, background: '#F3EDE3', position: 'relative', overflow: 'hidden' }}>
      <img
        src={reward.thumbnailImageUrl}
        alt={reward.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
        }}
      />
      {reward.status === 'expired' && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box style={{ background: '#EF4444', borderRadius: 20, padding: '2px 8px' }}>
            <p style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>Hết hạn</p>
          </Box>
        </Box>
      )}
    </Box>

    {/* Info */}
    <Box className="px-2 py-2" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Brand */}
      <Box flex className="items-center" style={{ gap: 4 }}>
        {reward.brandLogoUrl ? (
          <img
            src={reward.brandLogoUrl}
            alt={reward.brandName}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Box className="rounded-full flex-shrink-0" style={{ width: 14, height: 14, background: '#C49A6C' }} />
        )}
        <p className="truncate" style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
          {reward.brandName || getVoucherTypeLabel(reward.type)}
        </p>
      </Box>

      {/* Name */}
      <p
        style={{
          fontSize: 12,
          color: '#1a1a1a',
          fontWeight: 700,
          lineHeight: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: 32,
        }}
      >
        {reward.name}
      </p>

      {/* Cost */}
      <Box flex className="items-center" style={{ gap: 3 }}>
        <span style={{ fontSize: 13 }}>🪙</span>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#C49A6C' }}>
          {reward.pointsRequired.toLocaleString('vi-VN')}
        </p>
        <p style={{ fontSize: 9, color: '#D97706', fontWeight: 600 }}>{reward.costCurrency}</p>
      </Box>
    </Box>
  </Box>
);

// ─── Section ──────────────────────────────────────────────────────────────────

export const TopVouchers: FC = () => {
  const navigate = useNavigate();
  const { allVouchers, loading, loadAllVouchers } = useVouchersStore();

  useEffect(() => {
    if (!allVouchers.length) loadAllVouchers();
  }, []);

  const topVouchers = allVouchers
    .filter((r) => r.status === 'active')
    .slice(0, 8);

  const isLoading = loading && allVouchers.length === 0;

  return (
    <Box className="py-4">
      {/* Header */}
      <Box flex className="items-center justify-between px-4 mb-3">
        <Box flex className="items-center" style={{ gap: 8 }}>
          <Box
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)',
            }}
          >
            <Gift size={14} color="#fff" />
          </Box>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Ưu đãi nổi bật</p>
        </Box>
        <Box
          flex
          className="items-center cursor-pointer"
          style={{ gap: 2 }}
          onClick={() => navigate('/rewards')}
        >
          <p style={{ fontSize: 13, color: '#C49A6C', fontWeight: 600 }}>Xem tất cả</p>
          <ChevronRight size={14} color="#C49A6C" strokeWidth={2.5} />
        </Box>
      </Box>

      {/* Horizontal scroll */}
      <Box
        flex
        style={{
          overflowX: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
          gap: 10,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexWrap: 'nowrap',
        }}
      >
        {isLoading ? (
          [1, 2, 3].map((i) => <CardSkeleton key={i} />)
        ) : topVouchers.length === 0 ? null : (
          <>
            {topVouchers.map((reward) => (
              <VoucherCard
                key={reward.id}
                reward={reward}
                onClick={() => navigate(`/rewards/${reward.id}`)}
              />
            ))}

            {/* See all card */}
            <Box
              className="flex-shrink-0 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer"
              style={{ width: 100, minHeight: 155, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', gap: 8 }}
              onClick={() => navigate('/rewards')}
            >
              <Box
                className="flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #E8CFA0, #C49A6C)' }}
              >
                <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
              </Box>
              <p style={{ fontSize: 12, color: '#A0784A', fontWeight: 600, textAlign: 'center', lineHeight: '16px' }}>
                Xem thêm
              </p>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
