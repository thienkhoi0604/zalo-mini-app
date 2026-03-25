import React, { FC, useEffect, useState } from 'react';
import { Box, Modal, Page, useSnackbar } from 'zmp-ui';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useRewardsStore } from 'stores/rewards';
import { useUserStore } from 'stores/user';

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

interface ConfirmBuyModalProps {
  visible: boolean;
  name: string;
  pointsRequired: number;
  userPoints: number;
  redeeming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmBuyModal: FC<ConfirmBuyModalProps> = ({
  visible,
  name,
  pointsRequired,
  userPoints,
  redeeming,
  onConfirm,
  onCancel,
}) => {
  const hasEnough = userPoints >= pointsRequired;

  return (
    <Modal
      visible={visible}
      title="Xác nhận đổi điểm"
      onClose={onCancel}
      actions={[
        {
          text: redeeming ? 'Đang xử lý...' : 'Xác nhận',
          primary: true,
          disabled: !hasEnough || redeeming,
          onClick: onConfirm,
          highLight: hasEnough,
        },
        {
          text: 'Huỷ',
          onClick: onCancel,
        },
      ]}
    >
      <Box className="flex flex-col items-center" style={{ gap: 12, padding: '8px 0 4px' }}>
        <p style={{ fontSize: 14, color: '#444', textAlign: 'center', lineHeight: '20px' }}>
          Bạn có muốn đổi điểm để nhận
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', textAlign: 'center' }}>
          {name}
        </p>

        <Box
          className="w-full rounded-2xl"
          style={{ background: '#F9F9F9', padding: '12px 16px' }}
        >
          <Box flex className="items-center justify-between" style={{ marginBottom: 6 }}>
            <p style={{ fontSize: 13, color: '#888' }}>Chi phí</p>
            <Box flex className="items-center" style={{ gap: 4 }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                {pointsRequired}
              </p>
            </Box>
          </Box>
          <Box flex className="items-center justify-between">
            <p style={{ fontSize: 13, color: '#888' }}>Điểm của bạn</p>
            <Box flex className="items-center" style={{ gap: 4 }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: hasEnough ? '#288F4E' : '#EF4444',
                }}
              >
                {userPoints}
              </p>
            </Box>
          </Box>
        </Box>

        {!hasEnough && (
          <p style={{ fontSize: 13, color: '#EF4444', textAlign: 'center' }}>
            Bạn không đủ điểm để đổi phần thưởng này
          </p>
        )}
      </Box>
    </Modal>
  );
};

// ─── Reward Detail Page ────────────────────────────────────────────────────────

const RewardDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { owned?: boolean } };
  const owned = location.state?.owned === true;
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { allRewards, loadRewardById, redeemReward, redeeming } = useRewardsStore();
  const { user } = useUserStore();
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    if (id) {
      loadRewardById(id).catch(() => {
        openSnackbar({ text: 'Không thể tải thông tin thẻ', type: 'error' });
      });
    }
  }, [id]);

  const card = allRewards.find((c) => c.id === id);

  const handleBuy = async () => {
    if (!id) return;
    try {
      await redeemReward(id);
      setConfirmVisible(false);
      openSnackbar({ text: 'Đổi điểm thành công! Voucher đã được thêm vào tài khoản.', type: 'success' });
      setTimeout(() => navigate('/my-vouchers', { replace: true }), 1200);
    } catch {
      setConfirmVisible(false);
      openSnackbar({ text: 'Đổi điểm thất bại. Vui lòng thử lại.', type: 'error' });
    }
  };

  if (!card) {
    return (
      <Page className="flex-1 flex flex-col bg-gray-50 items-center justify-center">
        <p style={{ fontSize: 14, color: '#888' }}>
          Không tìm thấy phần thưởng.
        </p>
      </Page>
    );
  }

  return (
    <Page
      className="flex-1 flex flex-col"
      style={{ background: '#F5F0E8', position: 'relative' }}
    >
      {/* Scrollable body */}
      <Box className="flex-1 overflow-y-auto" style={{ paddingBottom: owned ? 0 : 84 }}>
        {/* ── Hero image ── */}
        <Box style={{ width: '100%', height: 220, flexShrink: 0, overflow: 'hidden' }}>
          <img
            src={card.bannerImageUrl || card.thumbnailImageUrl}
            alt={card.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
            }}
          />
        </Box>

        {/* ── Main info card ── */}
        <Box
          className="bg-white flex flex-col items-center"
          style={{ margin: '12px 16px 0', borderRadius: 16, padding: '20px 20px 20px', gap: 8 }}
        >
          {card.brandLogoUrl && (
            <img
              src={card.brandLogoUrl}
              alt={card.brandName}
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', marginBottom: 4 }}
            />
          )}

          <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', lineHeight: '24px' }}>
            {card.name}
          </p>

          <Box flex className="items-center justify-center" style={{ gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 22 }}>🪙</span>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
              {card.pointsRequired}
            </p>
            <p style={{ fontSize: 13, color: '#888' }}>điểm</p>
          </Box>

          {/* Validity */}
          {(card.applicableTimeStart || card.applicableTimeEnd) && (
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
              {card.applicableTimeStart
                ? `Từ ${new Date(card.applicableTimeStart).toLocaleDateString('vi-VN')}`
                : ''}
              {card.applicableTimeEnd
                ? ` — ${new Date(card.applicableTimeEnd).toLocaleDateString('vi-VN')}`
                : ''}
            </p>
          )}
        </Box>

        {/* ── Description ── */}
        {card.description && (
          <Box
            className="bg-white"
            style={{ margin: '12px 16px 0', borderRadius: 16, padding: '16px 16px' }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
              Mô tả
            </p>
            <p style={{ fontSize: 13, color: '#444', lineHeight: '21px', whiteSpace: 'pre-line' }}>
              {card.description}
            </p>
          </Box>
        )}

        {/* ── Cửa hàng áp dụng ── */}
        {card.stores && card.stores.length > 0 && (
          <Box
            className="bg-white"
            style={{ margin: '12px 16px 0', borderRadius: 16, padding: '16px 16px' }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
              Cửa hàng áp dụng ({card.stores.length})
            </p>
            <Box className="flex flex-col" style={{ gap: 10 }}>
              {card.stores.slice(0, 3).map((store: { address: string }, i: number) => (
                <Box key={i} flex className="items-start" style={{ gap: 8 }}>
                  <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
                  <p style={{ fontSize: 13, color: '#444', lineHeight: '19px', flex: 1 }}>
                    {store.address}
                  </p>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Điều khoản ── */}
        {(card.terms || card.programNotes || card.usageGuide) && (
          <Box
            className="bg-white"
            style={{ margin: '12px 16px 16px', borderRadius: 16, padding: '16px 16px' }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>
              Điều khoản sử dụng
            </p>
            <p style={{ fontSize: 13, color: '#444', lineHeight: '21px' }}>
              {card.terms || card.programNotes || card.usageGuide}
            </p>
          </Box>
        )}
      </Box>

      {/* ── Sticky buy button ── */}
      {!owned && (
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px',
            background: '#fff',
            boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
          }}
        >
          <Box flex className="items-center" style={{ gap: 10 }}>
            {/* Points balance */}
            <Box flex className="items-center" style={{ gap: 4 }}>
              <span style={{ fontSize: 16 }}>🪙</span>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                {user?.points ?? 0}
              </p>
            </Box>

            <Box
              onClick={() => setConfirmVisible(true)}
              className="flex-1 flex items-center justify-center cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #2D9E58 0%, #1A6B38 100%)',
                height: 52,
                borderRadius: 14,
              }}
            >
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                Đổi {card.pointsRequired} điểm
              </p>
            </Box>
          </Box>
        </Box>
      )}

      <ConfirmBuyModal
        visible={confirmVisible}
        name={card.name}
        pointsRequired={card.pointsRequired}
        userPoints={user?.points ?? 0}
        redeeming={redeeming}
        onConfirm={handleBuy}
        onCancel={() => setConfirmVisible(false)}
      />
    </Page>
  );
};

export default RewardDetailPage;
