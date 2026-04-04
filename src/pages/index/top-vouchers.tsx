import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Gift, LayoutGrid } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import { ACTIVE_THEME } from '@/constants/theme';
import logoImg from '@/assets/images/logo.png';

const FALLBACK = logoImg;
const NOTCH = 10;
const IMG_BG = '#F0F2F5';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <div
    className="flex-shrink-0 animate-pulse"
    style={{ width: 140, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
  >
    <div style={{ height: 95, background: '#E9EBED' }} />
    <div style={{ height: NOTCH * 2, background: '#EDEEF2' }} />
    <div style={{ padding: '8px 10px 12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ height: 9, width: '45%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 12, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 12, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 22, width: '50%', background: '#E9EBED', borderRadius: 7 }} />
    </div>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const VoucherCard: FC<{ reward: Voucher; onClick: () => void }> = ({ reward, onClick }) => {
  const brandLabel = reward.brandName ?? reward.category ?? '';
  return (
    <div
      className="flex-shrink-0 cursor-pointer"
      style={{
        width: 140,
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
      onClick={onClick}
    >
      {/* Top: image */}
      <div style={{ height: 95, background: IMG_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, overflow: 'hidden', position: 'relative' }}>
        <img
          src={reward.thumbnailImageUrl}
          alt={reward.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {reward.stock != null && (
          <div style={{
            position: 'absolute', top: 7, right: 7,
            background: reward.stock <= 5 ? '#EF4444' : '#F97316',
            borderRadius: 6, padding: '2px 6px',
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>Còn {reward.stock}</p>
          </div>
        )}
      </div>

      {/* Perforation divider */}
      <div style={{ position: 'relative', height: NOTCH * 2, background: IMG_BG }}>
        <div style={{ position: 'absolute', left: -NOTCH, top: 0, width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%', background: ACTIVE_THEME.pageBg }} />
        <div style={{
          position: 'absolute', top: '50%', left: NOTCH + 4, right: NOTCH + 4,
          transform: 'translateY(-50%)',
          backgroundImage: 'radial-gradient(circle, #B8BFC9 1.4px, transparent 1.4px)',
          backgroundSize: '8px 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          height: 2,
        }} />
        <div style={{ position: 'absolute', right: -NOTCH, top: 0, width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%', background: ACTIVE_THEME.pageBg }} />
      </div>

      {/* Bottom: brand + name + cost (white) */}
      <div style={{ padding: '8px 10px 12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: '1.5px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 3px rgba(40,143,78,0.2)' }}>
            <span style={{ fontSize: 6, fontWeight: 900, color: '#065F46' }}>{brandLabel.charAt(0).toUpperCase()}</span>
          </div>
          <p style={{ fontSize: 8.5, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {brandLabel}
          </p>
        </div>

        {/* Name */}
        <p style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', lineHeight: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32, letterSpacing: -0.1 }}>
          {reward.name}
        </p>

        {/* Cost */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '1px solid #FCD34D', borderRadius: 8, padding: '3px 8px', marginTop: 1, boxShadow: '0 1px 4px rgba(245,158,11,0.20)' }}>
          <CoinIcon size={11} />
          <p style={{ fontSize: 10.5, fontWeight: 800, color: '#92400E', letterSpacing: -0.2 }}>{reward.pointsRequired.toLocaleString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
};

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
      <Box flex className="items-center px-4 mb-3" style={{ gap: 8 }}>
        <Box
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            background: '#288F4E',
          }}
        >
          <Gift size={14} color="#fff" />
        </Box>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Vouchers</p>
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
          justifyContent: 'flex-start',
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
            {/* View all */}
            {topVouchers.length > 2 && <div
              className="flex-shrink-0 cursor-pointer"
              style={{
                width: 64,
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onClick={() => navigate('/rewards')}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#288F4E',
                  boxShadow: '0 4px 16px rgba(40,143,78,0.28), 0 1px 4px rgba(40,143,78,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LayoutGrid size={18} color="#fff" strokeWidth={2} />
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#288F4E', letterSpacing: 0.3, textAlign: 'center' }}>Tất cả</p>
            </div>}
          </>
        )}
      </Box>
    </Box>
  );
};
