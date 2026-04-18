import React, { FC, useEffect, useState } from 'react';
import logoImg from '@/assets/images/logo.png';
import { Box, Modal, Page, useSnackbar } from 'zmp-ui';
import { useParams, useLocation, useNavigate } from 'react-router';
import { openWebview } from 'zmp-sdk/apis';
import { MapPin, Calendar, FileText, Store, AlertCircle, Globe, Zap, Navigation } from 'lucide-react';
import { useVouchersStore } from '@/store/vouchers';
import { getVoucherTypeLabel } from '@/types/voucher';
import { useUserStore } from '@/store/user';
import PullToRefresh from '@/components/ui/pull-to-refresh';
import CoinIcon from '@/components/ui/coin-icon';

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

interface ConfirmBuyModalProps {
  visible: boolean;
  name: string;
  pointsRequired: number;
  costCurrency: string;
  userPoints: number;
  redeeming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmBuyModal: FC<ConfirmBuyModalProps> = ({
  visible, name, pointsRequired, costCurrency, userPoints, redeeming, onConfirm, onCancel,
}) => {
  const hasEnough = userPoints >= pointsRequired;
  const remaining = userPoints - pointsRequired;

  return (
    <Modal
      visible={visible}
      title='Xác nhận đổi voucher'
      onClose={onCancel}
      actions={[
        { text: 'Huỷ', onClick: onCancel },
        {
          text: redeeming ? 'Đang xử lý...' : 'Xác nhận đổi',
          disabled: !hasEnough || redeeming,
          onClick: onConfirm,
          highLight: hasEnough,
        },
      ]}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 0 8px' }}>
        <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: '19px' }}>
          Đổi {costCurrency} để nhận
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', textAlign: 'center', lineHeight: '22px' }}>
          {name}
        </p>

        <Box
          style={{
            background: '#F9FAFB', borderRadius: 16, padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}
        >
          <Box flex className="items-center justify-between">
            <p style={{ fontSize: 13, color: '#6B7280' }}>Chi phí</p>
            <Box flex className="items-center" style={{ gap: 5 }}>
              <CoinIcon size={18} />
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                {pointsRequired.toLocaleString('vi-VN')}
              </p>
            </Box>
          </Box>

          <Box style={{ height: 1, background: '#E5E7EB' }} />

          <Box flex className="items-center justify-between">
            <p style={{ fontSize: 13, color: '#6B7280' }}>{costCurrency} hiện có</p>
            <Box flex className="items-center" style={{ gap: 5 }}>
              <CoinIcon size={18} />
              <p style={{ fontSize: 15, fontWeight: 700, color: hasEnough ? '#288F4E' : '#EF4444' }}>
                {userPoints.toLocaleString('vi-VN')}
              </p>
            </Box>
          </Box>

          {hasEnough && (
            <>
              <Box style={{ height: 1, background: '#E5E7EB' }} />
              <Box flex className="items-center justify-between">
                <p style={{ fontSize: 13, color: '#6B7280' }}>Còn lại sau khi đổi</p>
                <Box flex className="items-center" style={{ gap: 5 }}>
                  <CoinIcon size={18} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>
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
            style={{ gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px' }}
          >
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#DC2626' }}>
              Bạn cần thêm {(pointsRequired - userPoints).toLocaleString('vi-VN')} {costCurrency} để đổi voucher này
            </p>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard: FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <Box
    className="bg-white rounded-2xl overflow-hidden"
    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
  >
    <Box
      flex
      className="items-center"
      style={{ gap: 8, padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}
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

// ─── Voucher Detail Page ───────────────────────────────────────────────────────

const VoucherDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { owned?: boolean } };
  const owned = location.state?.owned === true;
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { allVouchers, loading, loadVoucherById, redeemVoucher, redeeming } = useVouchersStore();
  const { pointWallet } = useUserStore();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const redirectTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (id) loadVoucherById(id, 'Reward').catch(() => openSnackbar({ text: 'Không thể tải thông tin', type: 'error' }));
  }, [id]);

  const card = allVouchers.find((c) => c.id === id);

  const handleBuy = async () => {
    if (!id) return;
    try {
      await redeemVoucher(id);
      setConfirmVisible(false);
      useUserStore.getState().loadPointWallet();
      openSnackbar({ text: `Đổi ${card?.costCurrency ?? 'Lá'} thành công! Voucher đã được thêm vào tài khoản.`, type: 'success' });
      redirectTimerRef.current = setTimeout(() => navigate('/my-vouchers', { replace: true }), 1200);
    } catch {
      setConfirmVisible(false);
      openSnackbar({ text: `Đổi ${card?.costCurrency ?? 'Lá'} thất bại. Vui lòng thử lại.`, type: 'error' });
    }
  };

  if (!card) {
    if (loading) {
      return (
        <Page className="flex-1 flex flex-col">
          <Box className="animate-pulse" style={{ padding: '0 0 88px' }}>
            <Box style={{ height: 240, background: '#E9EBED' }} />
            <Box style={{ margin: '-28px 16px 0', background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Box style={{ height: 16, width: '40%', background: '#E9EBED', borderRadius: 6 }} />
              <Box style={{ height: 22, width: '80%', background: '#E9EBED', borderRadius: 6 }} />
              <Box style={{ height: 1, background: '#F3F4F6' }} />
              <Box flex className="items-center justify-between">
                <Box style={{ height: 14, width: 60, background: '#E9EBED', borderRadius: 6 }} />
                <Box style={{ height: 32, width: 100, background: '#E9EBED', borderRadius: 100 }} />
              </Box>
            </Box>
            <Box style={{ margin: '12px 16px', borderRadius: 18, padding: 20, height: 80, background: '#E9EBED' }} />
          </Box>
        </Page>
      );
    }
    return (
      <Page className="flex-1 flex flex-col items-center justify-center">
        <Box className="flex flex-col items-center" style={{ gap: 12 }}>
          <Box className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: '#FEF9EF' }}>
            <span style={{ fontSize: 32 }}>🎁</span>
          </Box>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Không tìm thấy voucher</p>
        </Box>
      </Page>
    );
  }

  const userPoints = pointWallet?.currentBalance ?? 0;
  const hasEnough = userPoints >= card.pointsRequired;

  const handleRefresh = async () => {
    if (id) await loadVoucherById(id, 'Reward').catch(() => {});
  };

  return (
    <Page className="flex-1 flex flex-col" style={{ position: 'relative' }}>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1" style={{ paddingBottom: owned ? 16 : 88 }}>

        {/* Hero image + overlay */}
        <Box style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <img
            src={card.bannerImageUrl || card.thumbnailImageUrl}
            alt={card.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).src = logoImg; }}
          />
          <Box
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        </Box>

        {/* Info card — overlapping hero */}
        <Box style={{ padding: '0 16px', marginTop: -28, position: 'relative', zIndex: 2 }}>
          <Box
            className="bg-white rounded-2xl"
            style={{ padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {/* Brand + name */}
            <Box flex className="items-start" style={{ gap: 12 }}>
              {card.brandLogoUrl && (
                <img
                  src={card.brandLogoUrl}
                  alt={card.brandName}
                  style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #F0F0F0' }}
                />
              )}
              <Box style={{ flex: 1, minWidth: 0 }}>
                {card.brandName && (
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>
                    {card.brandName}
                  </p>
                )}
                <Box
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: '#EEF7F1', border: '1px solid #A7F3D0',
                    borderRadius: 100, padding: '3px 10px', marginBottom: 6,
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#288F4E' }}>{getVoucherTypeLabel(card.type)}</p>
                </Box>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: '24px' }}>
                  {card.name}
                </p>
                {card.shortDescription && (
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: '19px', marginTop: 4 }}>
                    {card.shortDescription}
                  </p>
                )}
              </Box>
            </Box>

            <Box style={{ height: 1, background: '#F3F4F6' }} />

            {/* Points / price row */}
            {card.source === 'StoreItem' ? (
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* VND price row */}
                {card.price != null && (
                  <Box flex className="items-center justify-between">
                    <p style={{ fontSize: 13, color: '#6B7280' }}>Giá gốc</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      {card.price.toLocaleString('vi-VN')}
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}> đ</span>
                    </p>
                  </Box>
                )}
                {/* Discounted prices from applicable vouchers */}
                {card.calculatedPrices && card.calculatedPrices.length > 0 && (
                  card.calculatedPrices.map((cp) => (
                    <Box key={cp.voucherId} flex className="items-center justify-between">
                      <p style={{ fontSize: 12, color: '#288F4E', flex: 1, marginRight: 8 }}>
                        {cp.discountDescription || cp.voucherName}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#288F4E' }}>
                        {cp.discountedPrice.toLocaleString('vi-VN')}
                        <span style={{ fontSize: 12, fontWeight: 600 }}> đ</span>
                      </p>
                    </Box>
                  ))
                )}
                {/* GreenCoin cost row */}
                <Box flex className="items-center justify-between">
                  <p style={{ fontSize: 13, color: '#6B7280' }}>Chi phí GreenCoin</p>
                  <Box
                    flex
                    className="items-center"
                    style={{
                      gap: 6,
                      background: 'linear-gradient(135deg, #FEF9EF, #FEF3C7)',
                      border: '1px solid #FDE68A',
                      borderRadius: 100,
                      padding: '5px 14px',
                    }}
                  >
                    <CoinIcon size={20} />
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#D97706' }}>
                      {card.pointsRequired.toLocaleString('vi-VN')}
                    </p>
                  </Box>
                </Box>
                {/* Stock */}
                {card.stock != null && (
                  <Box flex className="items-center justify-between">
                    <p style={{ fontSize: 13, color: '#6B7280' }}>Còn lại</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: card.stock <= 5 ? '#EF4444' : '#374151' }}>
                      {card.stock} sản phẩm
                    </p>
                  </Box>
                )}
              </Box>
            ) : (
              <Box flex className="items-center justify-between">
                <p style={{ fontSize: 13, color: '#6B7280' }}>Chi phí đổi</p>
                <Box
                  flex
                  className="items-center"
                  style={{
                    gap: 6,
                    background: 'linear-gradient(135deg, #FEF9EF, #FEF3C7)',
                    border: '1px solid #FDE68A',
                    borderRadius: 100,
                    padding: '5px 14px',
                  }}
                >
                  <CoinIcon size={20} />
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#D97706' }}>
                    {card.pointsRequired.toLocaleString('vi-VN')}
                  </p>
                </Box>
              </Box>
            )}

            {/* Validity */}
            {(card.applicableTimeStart || card.applicableTimeEnd) && (
              <Box flex className="items-center" style={{ gap: 6 }}>
                <Calendar size={13} color="#9CA3AF" />
                <p style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 700 }}>
                  {card.applicableTimeStart
                    ? `Từ ${new Date(card.applicableTimeStart).toLocaleDateString('vi-VN')}`
                    : ''}
                  {card.applicableTimeEnd
                    ? ` – ${new Date(card.applicableTimeEnd).toLocaleDateString('vi-VN')}`
                    : ''}
                </p>
              </Box>
            )}

            {/* Expired badge */}
            {card.status === 'expired' && (
              <Box
                flex
                className="items-center rounded-xl"
                style={{ gap: 7, background: '#FEF2F2', border: '1px solid #FECACA', padding: '8px 12px' }}
              >
                <AlertCircle size={14} color="#EF4444" />
                <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>Voucher này đã hết hạn</p>
              </Box>
            )}
          </Box>
        </Box>

        {/* Content sections */}
        <Box style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {card.description && (
            <SectionCard title="Mô tả" icon={<FileText size={15} color="#288F4E" />}>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: '21px', whiteSpace: 'pre-line' }}>
                {card.description}
              </p>
            </SectionCard>
          )}

          {/* Applicable locations */}
          {card.appliesToAll ? (
            <SectionCard title="Địa điểm áp dụng" icon={<Globe size={15} color="#0284C7" />}>
              <Box flex className="items-center" style={{ gap: 10 }}>
                <Box
                  style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #EEF7F1, #DCFCE7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Zap size={18} color="#288F4E" fill="#288F4E" strokeWidth={0} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Tất cả trạm sạc EcoGreen</p>
                  <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Áp dụng tại toàn bộ hệ thống trạm sạc</p>
                </Box>
              </Box>
            </SectionCard>
          ) : card.stores && card.stores.length > 0 ? (
            <SectionCard
              title={`Địa điểm áp dụng (${card.stores.length})`}
              icon={<Store size={15} color="#7C3AED" />}
            >
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {card.stores.map((store, i) => (
                  <Box
                    key={i}
                    flex
                    className="items-center"
                    style={{ gap: 10, padding: '10px 12px', background: '#F9FAFB', borderRadius: 12, border: '1px solid #F3F4F6' }}
                  >
                    <Box
                      onClick={() => store.id && navigate(`/stores/${store.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, cursor: store.id ? 'pointer' : 'default' }}
                    >
                      {store.imageUrl ? (
                        <img
                          src={store.imageUrl}
                          alt={store.name}
                          style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <Box
                          style={{
                            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                            background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Store size={20} color="#7C3AED" />
                        </Box>
                      )}
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {store.name}
                        </p>
                        {store.address && (
                          <Box flex className="items-center" style={{ gap: 3, marginTop: 3 }}>
                            <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {store.address}
                            </p>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {store.googleMapsDirectionUrl && (
                      <Box
                        onClick={(e) => { e.stopPropagation(); openWebview({ url: store.googleMapsDirectionUrl! }); }}
                        style={{
                          flexShrink: 0, width: 34, height: 34, borderRadius: 10,
                          background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <Navigation size={16} color="#7C3AED" />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </SectionCard>
          ) : null}

          {(card.terms || card.programNotes || card.usageGuide) && (
            <SectionCard title="Điều khoản sử dụng" icon={<AlertCircle size={15} color="#D97706" />}>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: '21px' }}>
                {card.terms || card.programNotes || card.usageGuide}
              </p>
            </SectionCard>
          )}
        </Box>
      </PullToRefresh>

      {/* Sticky bottom bar */}
      {!owned && card.status !== 'expired' && (
        <Box
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '12px 16px',
            background: '#fff',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Box flex className="items-center" style={{ gap: 10 }}>
            <Box
              style={{
                background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12,
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              }}
            >
              <CoinIcon size={18} />
              <p style={{ fontSize: 14, fontWeight: 700, color: hasEnough ? '#111827' : '#EF4444' }}>
                {userPoints.toLocaleString('vi-VN')}
              </p>
            </Box>
            <Box
              onClick={() => setConfirmVisible(true)}
              className="flex-1 flex items-center justify-center cursor-pointer"
              style={{
                background: hasEnough ? 'linear-gradient(135deg, #2FA85F, #1A6B38)' : '#E5E7EB',
                height: 50, borderRadius: 14, gap: 6,
              }}
            >
              <p style={{ color: hasEnough ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 15 }}>
                Đổi {card.pointsRequired.toLocaleString('vi-VN')}
              </p>
              <CoinIcon size={20} />
            </Box>
          </Box>
        </Box>
      )}

      <ConfirmBuyModal
        visible={confirmVisible}
        name={card.name}
        pointsRequired={card.pointsRequired}
        costCurrency={card.costCurrency}
        userPoints={userPoints}
        redeeming={redeeming}
        onConfirm={handleBuy}
        onCancel={() => setConfirmVisible(false)}
      />
    </Page>
  );
};

export default VoucherDetailPage;
