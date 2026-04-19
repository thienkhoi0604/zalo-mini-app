import React, {
  FC,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import logoImg from '@/assets/images/coin-logo.png';
import { Box, Modal, Page, useSnackbar } from 'zmp-ui';
import { useParams } from 'react-router';
import { AlertCircle, FileText, Ticket } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { useUserStore } from '@/store/user';
import CoinIcon from '@/components/ui/coin-icon';
import PullToRefresh from '@/components/ui/pull-to-refresh';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  primary: '#288F4E',
  primaryLight: '#EEF7F1', // ~10% primary tint — backgrounds, badges
  primaryBorder: '#A7D9B8', // ~30% primary tint — borders
  primaryDark: '#1A6B39', // darker shade — emphasis text
  primaryFade: '#D1EDD9', // mid tint — icon backgrounds, gradient end
} as const;

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

interface ConfirmBuyModalProps {
  visible: boolean;
  name: string;
  price: number | null | undefined;
  pointsRequired: number;
  userPoints: number;
  redeeming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmBuyModal: FC<ConfirmBuyModalProps> = ({
  visible,
  name,
  price,
  pointsRequired,
  userPoints,
  redeeming,
  onConfirm,
  onCancel,
}) => {
  const hasEnough = userPoints >= pointsRequired;
  const remaining = userPoints - pointsRequired;

  return (
    <Modal
      visible={visible}
      title="Xác nhận mua sản phẩm"
      onClose={onCancel}
      actions={[
        { text: 'Huỷ', onClick: onCancel },
        {
          text: redeeming ? 'Đang xử lý...' : 'Xác nhận mua',
          disabled: !hasEnough || redeeming,
          onClick: onConfirm,
          highLight: hasEnough,
        },
      ]}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: '4px 0 8px',
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: '19px',
          }}
        >
          Dùng Lá để mua
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            lineHeight: '22px',
          }}
        >
          {name}
        </p>

        <Box
          style={{
            background: '#F9FAFB',
            borderRadius: 16,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {price != null && (
            <>
              <Box flex className="items-center justify-between">
                <p style={{ fontSize: 13, color: '#6B7280' }}>Giá bán</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                  {price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </Box>
              <Box style={{ height: 1, background: '#E5E7EB' }} />
            </>
          )}

          <Box flex className="items-center justify-between">
            <p style={{ fontSize: 13, color: '#6B7280' }}>Chi phí Lá</p>
            <Box flex className="items-center" style={{ gap: 5 }}>
              <CoinIcon size={18} />
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                {pointsRequired.toLocaleString('vi-VN')}
              </p>
            </Box>
          </Box>

          <Box style={{ height: 1, background: '#E5E7EB' }} />

          <Box flex className="items-center justify-between">
            <p style={{ fontSize: 13, color: '#6B7280' }}>Lá hiện có</p>
            <Box flex className="items-center" style={{ gap: 5 }}>
              <CoinIcon size={18} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: hasEnough ? C.primary : '#EF4444',
                }}
              >
                {userPoints.toLocaleString('vi-VN')}
              </p>
            </Box>
          </Box>

          {hasEnough && (
            <>
              <Box style={{ height: 1, background: '#E5E7EB' }} />
              <Box flex className="items-center justify-between">
                <p style={{ fontSize: 13, color: '#6B7280' }}>
                  Còn lại sau khi mua
                </p>
                <Box flex className="items-center" style={{ gap: 5 }}>
                  <CoinIcon size={18} />
                  <p
                    style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}
                  >
                    {remaining.toLocaleString('vi-VN')}
                  </p>
                </Box>
              </Box>
            </>
          )}
        </Box>

        {!hasEnough && (
          <Box
            flex
            className="items-center rounded-xl"
            style={{
              gap: 8,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              padding: '10px 14px',
            }}
          >
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#DC2626' }}>
              Bạn cần thêm{' '}
              {(pointsRequired - userPoints).toLocaleString('vi-VN')} GreenCoin
            </p>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard: FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Box
    className="bg-white rounded-2xl overflow-hidden"
    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
  >
    <Box
      flex
      className="items-center"
      style={{
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <Box
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 28, height: 28, background: '#F9FAFB' }}
      >
        {icon}
      </Box>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</p>
    </Box>
    <Box style={{ padding: '12px 16px' }}>{children}</Box>
  </Box>
);

// ─── Voucher Row Card — notch + dashed separator (horizontal ticket style) ──────

const ROW_CARD_H = 80; // total card height (px) — fixed so SVG math works
const ROW_NOTCH_R = 10; // radius of the semi-circle notch
const ROW_CUT_X = 242; // x-position of the vertical perforation cut (left of CTA zone)
const ROW_CARD_RADIUS = 14; // corner radius
const ROW_BORDER_COLOR = 'rgba(0,0,0,0.08)';

/** Full horizontal ticket path: notches on TOP and BOTTOM at cx */
function buildRowNotchPathFull(w: number, h: number, cx: number): string {
  const r = ROW_CARD_RADIUS;
  const nr = ROW_NOTCH_R;

  return [
    `M 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    // top edge left → right, with top notch cutout (concave down into card)
    `L ${cx - nr} 0`,
    `A ${nr} ${nr} 0 0 0 ${cx + nr} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    // bottom edge right → left, with bottom notch cutout (concave up into card)
    `L ${cx + nr} ${h}`,
    `A ${nr} ${nr} 0 0 0 ${cx - nr} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `Z`,
  ].join(' ');
}

const RowNotchClipDef: FC<{ id: string; w: number; h: number; cx: number }> = ({
  id,
  w,
  h,
  cx,
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
          d={buildRowNotchPathFull(w, h, cx)}
          transform={`scale(${1 / w}, ${1 / h})`}
        />
      </clipPath>
    </defs>
  </svg>
);

const RowNotchBorderOverlay: FC<{ w: number; h: number; cx: number }> = ({
  w,
  h,
  cx,
}) => (
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${w} ${h}`}
    preserveAspectRatio="none"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    aria-hidden="true"
  >
    <path
      d={buildRowNotchPathFull(w, h, cx)}
      fill="none"
      stroke={ROW_BORDER_COLOR}
      strokeWidth={1}
    />
  </svg>
);

interface VoucherRowCardProps {
  name: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountValue: number;
  onRedeem: () => void;
}

const VoucherRowCard: FC<VoucherRowCardProps> = ({
  name,
  originalPrice,
  discountedPrice,
  discountValue,
  onRedeem,
}) => {
  const clipId = `vrc-${useId().replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setCardW(w);
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const hasMeasure = cardW > 0;
  // Clamp cut position so it never exceeds card width
  const cutX = Math.min(ROW_CUT_X, cardW - 60);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: ROW_CARD_H, width: '100%' }}
    >
      {hasMeasure && (
        <RowNotchClipDef id={clipId} w={cardW} h={ROW_CARD_H} cx={cutX} />
      )}

      {/* Clipped card body */}
      <div
        style={
          {
            position: 'absolute',
            inset: 0,
            background: '#fff',
            borderRadius: ROW_CARD_RADIUS,
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'stretch',
            overflow: 'hidden',
            ...(hasMeasure
              ? {
                  clipPath: `url(#${clipId})`,
                  WebkitClipPath: `url(#${clipId})`,
                }
              : {}),
          } as React.CSSProperties
        }
      >
        {/* Left zone: icon + text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 12px',
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryFade})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ticket size={18} color={C.primary} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={
                {
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: '18px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                } as React.CSSProperties
              }
            >
              {name}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 3,
              }}
            >
              {originalPrice != null && (
                <p
                  style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                  }}
                >
                  {originalPrice.toLocaleString('vi-VN')}đ
                </p>
              )}
              <p style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>
                {discountedPrice != null
                  ? `${discountedPrice.toLocaleString('vi-VN')}đ`
                  : `Giảm ${discountValue.toLocaleString('vi-VN')}đ`}
              </p>
            </div>
          </div>
        </div>

        {/* Spacer for notch width */}
        <div style={{ width: ROW_NOTCH_R * 2, flexShrink: 0 }} />

        {/* Right zone: CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 14px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRedeem();
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              color: C.primary,
              whiteSpace: 'nowrap',
            }}
          >
            Đổi ngay
          </button>
        </div>
      </div>

      {/* SVG border overlay */}
      {hasMeasure && (
        <RowNotchBorderOverlay w={cardW} h={ROW_CARD_H} cx={cutX} />
      )}

      {/* Dashed perforation line — centred exactly on the notch axis */}
      <div
        style={{
          position: 'absolute',
          left: cutX,
          top: ROW_NOTCH_R,
          bottom: ROW_NOTCH_R,
          width: 0,
          borderLeft: '1.5px dashed #D1D5DB',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </div>
  );
};

// ─── Store Item Detail Page ────────────────────────────────────────────────────

const StoreItemDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openSnackbar } = useSnackbar();
  const { allVouchers, loading, loadVoucherById, redeemVoucher, redeeming } =
    useVouchersStore();
  const { pointWallet } = useUserStore();
  const [pendingRedeem, setPendingRedeem] = useState<{
    id: string;
    name: string;
    pointCost: number;
  } | null>(null);

  useEffect(() => {
    if (id)
      loadVoucherById(id, 'StoreItem').catch(() =>
        openSnackbar({ text: 'Không thể tải thông tin', type: 'error' }),
      );
  }, [id]);

  const card = allVouchers.find((c) => c.id === id);

  if (!card) {
    if (loading) {
      return (
        <Page className="flex-1 flex flex-col">
          <Box className="animate-pulse" style={{ padding: '0 0 88px' }}>
            <Box style={{ height: 240, background: '#E9EBED' }} />
            <Box
              style={{
                margin: '-28px 16px 0',
                background: '#fff',
                borderRadius: 18,
                padding: 20,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <Box
                style={{
                  height: 16,
                  width: '40%',
                  background: '#E9EBED',
                  borderRadius: 6,
                }}
              />
              <Box
                style={{
                  height: 22,
                  width: '80%',
                  background: '#E9EBED',
                  borderRadius: 6,
                }}
              />
              <Box style={{ height: 1, background: '#F3F4F6' }} />
              <Box flex className="items-center justify-between">
                <Box
                  style={{
                    height: 14,
                    width: 60,
                    background: '#E9EBED',
                    borderRadius: 6,
                  }}
                />
                <Box
                  style={{
                    height: 32,
                    width: 100,
                    background: '#E9EBED',
                    borderRadius: 100,
                  }}
                />
              </Box>
            </Box>
            <Box
              style={{
                margin: '12px 16px',
                borderRadius: 18,
                padding: 20,
                height: 80,
                background: '#E9EBED',
              }}
            />
          </Box>
        </Page>
      );
    }
    return (
      <Page className="flex-1 flex flex-col items-center justify-center">
        <Box className="flex flex-col items-center" style={{ gap: 12 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>
            Không tìm thấy sản phẩm
          </p>
        </Box>
      </Page>
    );
  }

  const userPoints = pointWallet?.currentBalance ?? 0;

  const handleRedeemVoucher = async (voucherId: string) => {
    try {
      await redeemVoucher(voucherId);
      setPendingRedeem(null);
      useUserStore.getState().loadPointWallet();
      openSnackbar({
        text: 'Đổi voucher thành công! Voucher đã được thêm vào tài khoản.',
        type: 'success',
      });
    } catch {
      setPendingRedeem(null);
      openSnackbar({
        text: 'Đổi voucher thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    }
  };

  const handleRefresh = async () => {
    if (id) await loadVoucherById(id, 'StoreItem').catch(() => {});
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ position: 'relative' }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        {/* Hero image */}
        <Box style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <img
            src={card.bannerImageUrl || card.thumbnailImageUrl}
            alt={card.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = logoImg;
            }}
          />
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        </Box>

        {/* Info card — overlapping hero */}
        <Box
          style={{
            padding: '0 16px',
            marginTop: -28,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box
            className="bg-white rounded-2xl"
            style={{
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Store + name */}
            <Box flex className="items-start" style={{ gap: 12 }}>
              <Box style={{ flex: 1, minWidth: 0 }}>
                {card.brandName && (
                  <p
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                      marginBottom: 4,
                    }}
                  >
                    {card.brandName}
                  </p>
                )}
                <Box
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: C.primaryLight,
                    border: `1px solid ${C.primaryBorder}`,
                    borderRadius: 100,
                    padding: '3px 10px',
                    marginBottom: 6,
                  }}
                >
                  <p
                    style={{ fontSize: 11, fontWeight: 700, color: C.primary }}
                  >
                    Chi tiết sản phẩm
                  </p>
                </Box>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: '24px',
                  }}
                >
                  {card.name}
                </p>
                {card.shortDescription && (
                  <p
                    style={{
                      fontSize: 13,
                      color: '#6B7280',
                      lineHeight: '19px',
                      marginTop: 4,
                    }}
                  >
                    {card.shortDescription}
                  </p>
                )}
              </Box>
            </Box>

            <Box style={{ height: 1, background: '#F3F4F6' }} />

            {/* Price row */}
            <Box flex className="items-center justify-between">
              <p style={{ fontSize: 13, color: '#6B7280' }}>Giá bán</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                {card.price != null
                  ? card.price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                  : '—'}
              </p>
            </Box>

            {/* Stock */}
            {card.stock != null && (
              <Box flex className="items-center" style={{ gap: 6 }}>
                <p
                  style={{
                    fontSize: 12,
                    color: card.stock <= 5 ? '#EF4444' : '#9CA3AF',
                    fontWeight: 600,
                  }}
                >
                  Còn lại: {card.stock} sản phẩm
                </p>
              </Box>
            )}
          </Box>
        </Box>

        {/* Content sections */}
        <Box
          style={{
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {card.description && (
            <SectionCard
              title="Mô tả"
              icon={<FileText size={15} color={C.primary} />}
            >
              <p
                style={{
                  fontSize: 13,
                  color: '#4B5563',
                  lineHeight: '21px',
                  whiteSpace: 'pre-line',
                }}
              >
                {card.description}
              </p>
            </SectionCard>
          )}

          {/* Applied vouchers — redesigned */}
          {card.appliedVoucherDetails &&
            card.appliedVoucherDetails.length > 0 && (
              <SectionCard
                title={`Voucher áp dụng (${card.appliedVoucherDetails.length})`}
                icon={<Ticket size={15} color={C.primary} />}
              >
                <Box
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {card.appliedVoucherDetails.map((voucher) => {
                    const calculated = card.calculatedPrices?.find(
                      (p) => p.voucherId === voucher.id,
                    );
                    return (
                      <VoucherRowCard
                        key={voucher.id}
                        name={voucher.name}
                        discountValue={voucher.discountValue}
                        originalPrice={calculated?.originalPrice}
                        discountedPrice={calculated?.discountedPrice}
                        onRedeem={() =>
                          setPendingRedeem({
                            id: voucher.id,
                            name: voucher.name,
                            pointCost: voucher.pointCost ?? 0,
                          })
                        }
                      />
                    );
                  })}
                </Box>
              </SectionCard>
            )}
        </Box>
      </PullToRefresh>

      <ConfirmBuyModal
        visible={!!pendingRedeem}
        name={pendingRedeem?.name ?? ''}
        price={undefined}
        pointsRequired={pendingRedeem?.pointCost ?? 0}
        userPoints={userPoints}
        redeeming={redeeming}
        onConfirm={() => pendingRedeem && handleRedeemVoucher(pendingRedeem.id)}
        onCancel={() => setPendingRedeem(null)}
      />
    </Page>
  );
};

export default StoreItemDetailPage;
