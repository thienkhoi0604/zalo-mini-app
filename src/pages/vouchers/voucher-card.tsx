import React, { FC } from 'react';
import { Voucher } from '@/types/voucher';
import CoinIcon from '@/components/ui/coin-icon';
import logoImg from '@/assets/images/logo.png';

interface Props {
  card: Voucher;
  onClick: (card: Voucher) => void;
}

const FALLBACK = logoImg;
const NOTCH_R = 12;
const CUT_Y = 120;
const BORDER_COLOR = 'rgba(0,0,0,0.08)';

const CARD_MASK = `
  radial-gradient(circle ${NOTCH_R}px at 0 ${CUT_Y + NOTCH_R}px, transparent ${NOTCH_R}px, black ${NOTCH_R + 0.5}px) 0 0 / 100% 100% no-repeat,
  radial-gradient(circle ${NOTCH_R}px at 100% ${CUT_Y + NOTCH_R}px, transparent ${NOTCH_R}px, black ${NOTCH_R + 0.5}px) 0 0 / 100% 100% no-repeat
`.trim();

const VoucherCard: FC<Props> = ({ card, onClick }) => {
  return (
    <div
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{
        height: 260,
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      {/* ── Card (masked) ── */}
      <div
        style={{
          borderRadius: 18,
          height: '100%',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 16px 28px rgba(0,0,0,0.06)',
          border: `1px solid ${BORDER_COLOR}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          WebkitMask: CARD_MASK,
          WebkitMaskComposite: 'destination-in',
          mask: CARD_MASK,
          maskComposite: 'intersect',
        } as React.CSSProperties}
      >
        {/* ── Image ── */}
        <div style={{ height: CUT_Y, overflow: 'hidden', position: 'relative' }}>
          <img
            src={card.thumbnailImageUrl}
            alt={card.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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

        {/* ── Perforation ── */}
        <div style={{ position: 'relative', height: NOTCH_R * 2, background: '#fff' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: NOTCH_R + 4,
            right: NOTCH_R + 4,
            transform: 'translateY(-50%)',
            borderTop: '1.5px dashed #D1D5DB',
            height: 0,
          }} />
        </div>

        {/* ── Content ── */}
        <div style={{
          padding: '9px 12px 13px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          flex: 1,
        }}>
          <p style={{
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
          }}>
            {card.name}
          </p>

          {card.shortDescription && (
            <p style={{
              fontSize: 10,
              color: '#6B7280',
              lineHeight: '14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {card.shortDescription}
            </p>
          )}

          <div style={{
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
          }}>
            <CoinIcon size={12} />
            <p style={{ fontSize: 11, fontWeight: 800, color: '#92400E', letterSpacing: -0.2 }}>
              {card.pointsRequired.toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Notch arc border (left) ── */}
      <div style={{
        position: 'absolute', left: 0, top: CUT_Y,
        width: NOTCH_R, height: NOTCH_R * 2,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', left: -NOTCH_R, top: 0,
          width: NOTCH_R * 2, height: NOTCH_R * 2,
          borderRadius: '50%',
          border: `1px solid ${BORDER_COLOR}`,
          boxSizing: 'border-box',
        }} />
      </div>

      {/* ── Notch arc border (right) ── */}
      <div style={{
        position: 'absolute', right: 0, top: CUT_Y,
        width: NOTCH_R, height: NOTCH_R * 2,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', right: -NOTCH_R, top: 0,
          width: NOTCH_R * 2, height: NOTCH_R * 2,
          borderRadius: '50%',
          border: `1px solid ${BORDER_COLOR}`,
          boxSizing: 'border-box',
        }} />
      </div>
    </div>
  );
};

export default VoucherCard;
