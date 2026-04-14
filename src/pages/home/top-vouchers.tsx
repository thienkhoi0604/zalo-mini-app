import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { Gift } from 'lucide-react';
import { Voucher, FEED_ITEM_TYPES } from '@/types/voucher';
import { getFeedItems } from '@/api/feed';
import CoinIcon from '@/components/ui/coin-icon';
import SectionHeader from '@/components/ui/section-header';
import ViewAllFab from '@/components/ui/view-all-fab';
import logoImg from '@/assets/images/logo.png';

const FALLBACK = logoImg;
const NOTCH_R = 12;
const CUT_Y = 95;
const BORDER_COLOR = 'rgba(0,0,0,0.08)';
const CARD_W = 140;
const CARD_H = 230;
const CARD_R = 18;

/* ── Notch-shaped SVG path builder ─────────────────────────────────────────── */

function buildNotchPath(w: number, h: number): string {
  const r = CARD_R;
  const nr = NOTCH_R;
  const ny = CUT_Y;

  return [
    `M 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${ny}`,
    `A ${nr} ${nr} 0 0 0 ${w} ${ny + nr * 2}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${ny + nr * 2}`,
    `A ${nr} ${nr} 0 0 0 0 ${ny}`,
    `Z`,
  ].join(' ');
}

/* ── Hidden SVG clip-path definition ───────────────────────────────────────── */

const NotchClipDef: FC<{ id: string }> = ({ id }) => (
  <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
    <defs>
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <path d={buildNotchPath(CARD_W, CARD_H)} transform={`scale(${1 / CARD_W}, ${1 / CARD_H})`} />
      </clipPath>
    </defs>
  </svg>
);

/* ── SVG border overlay (replaces CSS border that clip-path cuts off) ──────── */

const NotchBorderOverlay: FC = () => (
  <svg
    width={CARD_W}
    height={CARD_H}
    viewBox={`0 0 ${CARD_W} ${CARD_H}`}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    aria-hidden="true"
  >
    <path d={buildNotchPath(CARD_W, CARD_H)} fill="none" stroke={BORDER_COLOR} strokeWidth={1} />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: FC = () => (
  <div
    className="flex-shrink-0 animate-pulse"
    style={{ width: CARD_W, borderRadius: CARD_R, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
  >
    <div style={{ height: CUT_Y, background: '#E9EBED' }} />
    <div style={{ height: NOTCH_R * 2, background: '#EDEEF2' }} />
    <div style={{ padding: '8px 10px 12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ height: 9, width: '45%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 12, width: '90%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 12, width: '65%', background: '#E9EBED', borderRadius: 5 }} />
      <div style={{ height: 22, width: '50%', background: '#E9EBED', borderRadius: 7 }} />
    </div>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

/** Unique clip-path ID counter (safe for non-SSR Zalo Mini App context) */
let clipIdCounter = 0;

const VoucherCard: FC<{ reward: Voucher; onClick: () => void }> = ({ reward, onClick }) => {
  const [clipId] = useState(() => `tv-clip-${++clipIdCounter}`);

  return (
    <div
      className="flex-shrink-0 cursor-pointer"
      style={{ width: CARD_W, height: CARD_H, position: 'relative' }}
      onClick={onClick}
    >
      <NotchClipDef id={clipId} />

      {/* ── Card (clipped) ── */}
      <div
        style={{
          borderRadius: CARD_R,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.06)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        } as React.CSSProperties}
      >
        {/* ── Image ── */}
        <div style={{ height: CUT_Y, overflow: 'hidden', position: 'relative' }}>
          <img
            src={reward.thumbnailImageUrl}
            alt={reward.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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

        {/* ── Perforation ── */}
        <div style={{ position: 'relative', height: NOTCH_R * 2, background: '#fff' }}>
          <div style={{
            position: 'absolute', top: '50%', left: NOTCH_R + 4, right: NOTCH_R + 4,
            transform: 'translateY(-50%)',
            borderTop: '1.5px dashed #D1D5DB',
            height: 0,
          }} />
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '8px 10px 12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', lineHeight: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32, letterSpacing: -0.1 }}>
            {reward.name}
          </p>
          {reward.shortDescription && (
            <p style={{ fontSize: 10, color: '#6B7280', lineHeight: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 2 }}>
              {reward.shortDescription}
            </p>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '1px solid #FCD34D', borderRadius: 8, padding: '3px 8px', marginTop: 'auto', boxShadow: '0 1px 4px rgba(245,158,11,0.20)' }}>
            <CoinIcon size={11} />
            <p style={{ fontSize: 10.5, fontWeight: 800, color: '#92400E', letterSpacing: -0.2 }}>{reward.pointsRequired.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* ── SVG border overlay ── */}
      <NotchBorderOverlay />

      {/* ── Dashed perforation line ── */}
      <div style={{
        position: 'absolute',
        top: CUT_Y + NOTCH_R,
        left: NOTCH_R + 4,
        right: NOTCH_R + 4,
        height: 0,
        borderTop: '1.5px dashed #D1D5DB',
        pointerEvents: 'none',
        zIndex: 3,
      }} />
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────

export const TopVouchers: FC = () => {
  const navigate = useNavigate();
  const [topVouchers, setTopVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeedItems({ type: FEED_ITEM_TYPES.VOUCHER,       pageNumber: 1, pageSize: 4 }),
      getFeedItems({ type: FEED_ITEM_TYPES.PHYSICAL_ITEM, pageNumber: 1, pageSize: 4 }),
    ])
      .then(([vouchers, physical]) =>
        setTopVouchers([...vouchers, ...physical].filter((r) => r.status === 'active'))
      )
      .finally(() => setLoading(false));
  }, []);

  const isLoading = loading && topVouchers.length === 0;

  if (!isLoading && topVouchers.length === 0) return null;

  return (
    <Box className="py-4">
      <SectionHeader
        title="Vouchers"
        icon={<Gift size={14} color="#fff" />}
        onViewAll={() => navigate('/rewards/all')}
      />

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
                onClick={() => {
                  sessionStorage.setItem('home-scroll-section', 'section-vouchers');
                  navigate(`/rewards/${reward.id}`);
                }}
              />
            ))}
            {topVouchers.length > 2 && <ViewAllFab onClick={() => navigate('/rewards/all')} />}
          </>
        )}
      </Box>
    </Box>
  );
};