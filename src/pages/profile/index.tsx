import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Car, Gift, History, QrCode, ShieldCheck, UserPlus2, BookOpen } from 'lucide-react';
import { useUserStore } from '@/store/user';
import { useVouchersStore } from '@/store/vouchers';
import { fetchQRSession, fetchReferralQR, fetchReferralRules, ReferralRule } from '@/api/user';
import CoinIcon from '@/components/ui/coin-icon';
import { COLORS } from '@/constants';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';
import QRCodeSheet from './qr-code-sheet';
import PullToRefresh from '@/components/ui/pull-to-refresh';

const ICON_COLOR = '#fff';
const ICON_SIZE = 18;

type QRSheetType = 'checkin' | 'referral' | null;

const buildReferralHint = (rule: ReferralRule | null): React.ReactNode => {
  if (!rule) return '💡 Chia sẻ mã này để bạn bè quét và nhận điểm thưởng giới thiệu';
  return (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span style={{ color: '#9CA3AF' }}>💡 Chia sẻ mã này để giới thiệu bạn bè</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 800, fontSize: 16, color: COLORS.primary }}>
        Bạn nhận +{rule.pointsPerReferral}
        <CoinIcon size={16} />
        mỗi lần thành công
      </span>
      {(rule.pointsForReferredUser ?? 0) > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#6B7280' }}>
          Bạn bè được tặng thêm +{rule.pointsForReferredUser}
          <CoinIcon size={12} />
          khi đăng ký
        </span>
      )}
    </span>
  );
};

const CHECKIN_QR_CONFIG = {
  fetchData: () => fetchQRSession(null, 'Checkin').then((d) => d.token),
  title: 'Mã QR của tôi',
  hint: '💡 Cho nhân viên quét mã này để nhận điểm tại trạm sạc',
};

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const navigate = useNavigate();
  const { user, pointWallet } = useUserStore();
  const { loadUserVouchersCount } = useVouchersStore();
  const [activeQRSheet, setActiveQRSheet] = useState<QRSheetType>(null);
  const [referralRule, setReferralRule] = useState<ReferralRule | null>(null);

  useEffect(() => {
    loadUserVouchersCount();
    fetchReferralRules().then(setReferralRule);
  }, []);

  const vehicleStatus = pointWallet?.vehicleStatus;
  const isVehicleSubmitted = !!vehicleStatus;

  const referralQRConfig = {
    fetchData: fetchReferralQR,
    title: 'QR giới thiệu người dùng',
    hint: buildReferralHint(referralRule),
  };
  const activeConfig = activeQRSheet === 'checkin' ? CHECKIN_QR_CONFIG : activeQRSheet === 'referral' ? referralQRConfig : null;

  return (
    <Box className="py-7">
      <MemberCard />

      {user && !isVehicleSubmitted && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        items={[
          {
            icon: <Gift size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Voucher của bạn',
            onPress: () => navigate('/my-vouchers'),
          },
          ...(isVehicleSubmitted ? [{
            icon: <Car size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Thông tin xe của tôi',
            onPress: () => navigate('/vehicle-info'),
          }] : []),
        ]}
      />

      <SectionList
        title="Mã QR"
        items={[
          {
            icon: <QrCode size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Mã QR của tôi',
            sub: 'Mã cá nhân để tích điểm',
            onPress: () => setActiveQRSheet('checkin'),
          },
          {
            icon: <UserPlus2 size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'QR giới thiệu người dùng',
            sub: 'Chia sẻ để nhận điểm thưởng',
            onPress: () => setActiveQRSheet('referral'),
          },
        ]}
      />

      <SectionList
        title="Dành cho bạn"
        items={[
          {
            icon: <ShieldCheck size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Quyền lợi xếp hạng',
            sub: user?.rank?.currentRankName ? `Hạng ${user.rank.currentRankName}` : undefined,
            onPress: () => navigate('/rank-benefits'),
          },
          {
            icon: <History size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Lịch sử điểm',
            sub: 'Xem các lần check-in tích điểm',
            onPress: () => navigate('/checkin-history'),
          },
        ]}
      />

      <SectionList
        title="Hệ thống"
        items={[
          {
            icon: <BookOpen size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Khái niệm và điều khoản',
            onPress: () => navigate('/policy'),
          },
        ]}
      />

      {activeConfig && (
        <QRCodeSheet
          visible={activeQRSheet !== null}
          onClose={() => setActiveQRSheet(null)}
          fetchData={activeConfig.fetchData}
          title={activeConfig.title}
          hint={activeConfig.hint}
        />
      )}
    </Box>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

const ProfilePage: FC = () => {
  const { loadPointWallet } = useUserStore();
  const { loadUserVouchersCount } = useVouchersStore();

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <PullToRefresh
        onRefresh={async () => { await Promise.all([loadPointWallet(), loadUserVouchersCount()]); }}
        className="flex-1"
      >
        <Personal />
      </PullToRefresh>
    </Page>
  );
};

export default ProfilePage;
