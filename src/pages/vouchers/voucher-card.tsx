import React, { FC } from 'react';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import { ACTIVE_THEME } from '@/constants/theme';
import logoImg from '@/assets/images/logo.png';

interface Props {
  card: Voucher;
  onClick: (card: Voucher) => void;
}

const FALLBACK = logoImg;
const NOTCH = 13;
const IMG_BG = '#F0F2F5';

const VoucherCard: FC<Props> = ({ card, onClick }) => {
  const brandLabel = card.brandName ?? card.category ?? '';

  return (
    <div
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Top: image on gray ── */}
      <div
        style={{
          height: 122,
          background: IMG_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={card.thumbnailImageUrl}
          alt={card.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.13))' }}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {card.stock != null && (
          <div style={{
            position: 'absolute', top: 7, right: 7,
            background: card.stock <= 5 ? '#EF4444' : '#F97316',
            borderRadius: 6, padding: '2px 6px',
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>Còn {card.stock}</p>
          </div>
        )}
      </div>

      {/* ── Perforation divider ── */}
      <div style={{ position: 'relative', height: NOTCH * 2, background: IMG_BG }}>
        {/* Left notch — page-bg colored circle clips to a right-facing semicircle */}
        <div style={{
          position: 'absolute', left: -NOTCH, top: 0,
          width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%',
          background: ACTIVE_THEME.pageBg,
        }} />
        {/* Dot perforation */}
        <div style={{
          position: 'absolute', top: '50%', left: NOTCH + 4, right: NOTCH + 4,
          transform: 'translateY(-50%)',
          backgroundImage: 'radial-gradient(circle, #B8BFC9 1.4px, transparent 1.4px)',
          backgroundSize: '8px 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          height: 2,
        }} />
        {/* Right notch */}
        <div style={{
          position: 'absolute', right: -NOTCH, top: 0,
          width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%',
          background: ACTIVE_THEME.pageBg,
        }} />
      </div>

      {/* ── Bottom: brand + name + cost (white) ── */}
      <div style={{ padding: '10px 12px 14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 5 }}>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
            border: '1.5px solid #6EE7B7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(40,143,78,0.22)',
          }}>
            <span style={{ fontSize: 8, fontWeight: 900, color: '#065F46' }}>
              {brandLabel.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{
            fontSize: 9, color: '#9CA3AF', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.7,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {brandLabel}
          </p>
        </div>

        {/* Voucher name */}
        <p style={{
          fontSize: 12, fontWeight: 700, color: '#0F172A', lineHeight: '17px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 34,
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
          borderRadius: 9, padding: '4px 10px',
          marginTop: 1,
          boxShadow: '0 1px 5px rgba(245,158,11,0.22)',
        }}>
          <CoinIcon size={13} />
          <p style={{ fontSize: 12, fontWeight: 800, color: '#92400E', letterSpacing: -0.2 }}>
            {card.pointsRequired.toLocaleString('vi-VN')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default VoucherCard;
