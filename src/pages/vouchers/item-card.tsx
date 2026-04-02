import React, { FC } from 'react';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import logoImg from '@/assets/images/logo.png';

interface Props {
  card: Voucher;
  onClick?: (card: Voucher) => void;
}

const FALLBACK = logoImg;
const NOTCH = 12;

const VoucherItemCard: FC<Props> = ({ card, onClick }) => {
  const brandLabel = card.brandName ?? card.category ?? '';

  return (
    <div
      onClick={() => onClick?.(card)}
      className="flex-shrink-0 cursor-pointer"
      style={{
        width: 160,
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.04)',
        position: 'relative',
      }}
    >
      {/* ── Accent strip ── */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #288F4E, #34D17A)' }} />

      {/* ── Top: image ── */}
      <div
        style={{
          height: 108,
          background: 'linear-gradient(160deg, #F7F8FA 0%, #EDEEF2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
          overflow: 'hidden',
        }}
      >
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
      </div>

      {/* ── Perforation divider ── */}
      <div style={{ position: 'relative', height: NOTCH * 2, background: 'linear-gradient(160deg, #F7F8FA 0%, #EDEEF2 100%)' }}>
        {/* Left notch */}
        <div style={{
          position: 'absolute', left: -NOTCH, top: 0,
          width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%',
          background: '#fff',
          boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.06)',
        }} />
        {/* Dots */}
        <div style={{
          position: 'absolute', top: '50%', left: NOTCH + 4, right: NOTCH + 4,
          transform: 'translateY(-50%)',
          backgroundImage: 'radial-gradient(circle, #C8CDD6 1.2px, transparent 1.2px)',
          backgroundSize: '7px 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          height: 2,
        }} />
        {/* Right notch */}
        <div style={{
          position: 'absolute', right: -NOTCH, top: 0,
          width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%',
          background: '#fff',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.06)',
        }} />
      </div>

      {/* ── Bottom: brand + name + cost ── */}
      <div style={{ padding: '9px 12px 13px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 5 }}>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 17, height: 17, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
            border: '1.5px solid #6EE7B7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(40,143,78,0.2)',
          }}>
            <span style={{ fontSize: 7, fontWeight: 900, color: '#065F46' }}>
              {brandLabel.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{
            fontSize: 8.5, color: '#9CA3AF', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.7,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {brandLabel}
          </p>
        </div>

        {/* Voucher name */}
        <p style={{
          fontSize: 11.5, fontWeight: 700, color: '#0F172A', lineHeight: '16px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 32,
          letterSpacing: -0.1,
        }}>
          {card.name}
        </p>

        {/* Cost badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1px solid #FCD34D',
          borderRadius: 8, padding: '3px 8px',
          marginTop: 1,
          boxShadow: '0 1px 4px rgba(245,158,11,0.20)',
        }}>
          <CoinIcon size={12} />
          <p style={{ fontSize: 11, fontWeight: 800, color: '#92400E', letterSpacing: -0.2 }}>
            {card.pointsRequired.toLocaleString('vi-VN')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default VoucherItemCard;
