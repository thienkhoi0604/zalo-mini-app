import React, { FC, useId } from 'react';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import logoImg from '@/assets/images/logo.png';

interface Props {
  card: Voucher;
  onClick?: (card: Voucher) => void;
  /** Fixed pixel width for horizontal-scroll contexts. Omit to fill the container (grid). */
  width?: number;
}

const FALLBACK = logoImg;
const NOTCH_R = 12;
const CUT_Y = 120;
const CARD_HEIGHT = 250;
const BORDER_COLOR = 'rgba(0,0,0,0.08)';
const CARD_RADIUS = 18;
const DEFAULT_WIDTH = 200;

/* ── Notch-shaped SVG path builder ─────────────────────────────────────────── */

function buildNotchPath(w: number, h: number): string {
  const r = CARD_RADIUS;
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

const NotchClipDef: FC<{ id: string; w: number; h: number }> = ({
  id,
  w,
  h,
}) => (
  <svg
    width="0"
    height="0"
    style={{ position: 'absolute', pointerEvents: 'none' }}
    aria-hidden="true"
  >
    <defs>
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <path
          d={buildNotchPath(w, h)}
          transform={`scale(${1 / w}, ${1 / h})`}
        />
      </clipPath>
    </defs>
  </svg>
);

/* ── SVG border overlay (replaces CSS border that clip-path cuts off) ──────── */

const NotchBorderOverlay: FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    aria-hidden="true"
  >
    <path
      d={buildNotchPath(w, h)}
      fill="none"
      stroke={BORDER_COLOR}
      strokeWidth={1}
    />
  </svg>
);

/* ── VoucherCard ───────────────────────────────────────────────────────────── */

const VoucherCard: FC<Props> = ({ card, onClick, width }) => {
  const clipId = `vc-${useId().replace(/:/g, '')}`;
  const cardW = width ?? DEFAULT_WIDTH;

  return (
    <div
      onClick={() => onClick?.(card)}
      className={`cursor-pointer${width ? ' flex-shrink-0' : ''}`}
      style={{
        ...(width ? { width } : {}),
        height: CARD_HEIGHT,
        position: 'relative',
      }}
    >
      <NotchClipDef id={clipId} w={cardW} h={CARD_HEIGHT} />

      {/* ── Clipped card ── */}
      <div
        style={
          {
            borderRadius: CARD_RADIUS,
            height: '100%',
            background: '#fff',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          } as React.CSSProperties
        }
      >
        {/* Image */}
        <div
          style={{ height: CUT_Y, overflow: 'hidden', position: 'relative' }}
        >
          <img
            src={card.thumbnailImageUrl}
            alt={card.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK;
            }}
          />
          {card.stock != null && (
            <div
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                background: card.stock <= 5 ? '#EF4444' : '#F97316',
                borderRadius: 6,
                padding: '2px 6px',
              }}
            >
              <p style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>
                Còn {card.stock}
              </p>
            </div>
          )}
        </div>

        {/* Perforation spacer */}
        <div
          style={{ height: NOTCH_R * 2, background: '#fff', flexShrink: 0 }}
        />

        {/* Content */}
        <div
          style={{
            padding: '9px 12px 13px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 32,
              letterSpacing: -0.1,
            }}
          >
            {card.name}
          </p>

          {card.shortDescription && (
            <p
              style={{
                fontSize: 10,
                color: '#6B7280',
                lineHeight: '14px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {card.shortDescription}
            </p>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              alignSelf: 'flex-start',
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '1px solid #FCD34D',
              borderRadius: 8,
              padding: '3px 8px',
              marginTop: 'auto',
              boxShadow: '0 1px 4px rgba(245,158,11,0.20)',
            }}
          >
            <CoinIcon size={12} />
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#92400E',
                letterSpacing: -0.2,
              }}
            >
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* ── SVG border overlay ── */}
      <NotchBorderOverlay w={cardW} h={CARD_HEIGHT} />

      {/* Dashed perforation line */}
      <div
        style={{
          position: 'absolute',
          top: CUT_Y + NOTCH_R,
          left: NOTCH_R + 4,
          right: NOTCH_R + 4,
          height: 0,
          borderTop: '1.5px dashed #D1D5DB',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </div>
  );
};

export default VoucherCard;
