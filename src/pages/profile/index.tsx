import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Car, Gift, History, QrCode, ShieldCheck, UserPlus2 } from 'lucide-react';
import { useUserStore } from '@/stores/user';
import { useRewardsStore } from '@/stores/rewards';
import { fetchQRSession, fetchReferralQR } from '@/apis/user';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';
import QRCodeSheet from './qr-code-sheet';
import PullToRefresh from '@/components/pull-to-refresh';

const ICON_COLOR = '#A0784A';
const ICON_SIZE = 18;

type QRSheetType = 'checkin' | 'referral' | null;

const QR_SHEET_CONFIG: Record<
  NonNullable<QRSheetType>,
  { fetchData: () => Promise<string>; title: string; hint: string }
> = {
  checkin: {
    fetchData: () => fetchQRSession(null, 'Checkin').then((d) => d.token),
    title: 'QR Code của tôi',
    hint: '💡 Cho nhân viên quét mã này để nhận điểm tại trạm sạc',
  },
  referral: {
    fetchData: fetchReferralQR,
    title: 'QR giới thiệu người dùng',
    hint: '💡 Chia sẻ mã này để bạn bè quét và nhận điểm thưởng giới thiệu',
  },
};

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const navigate = useNavigate();
  const { user, pointWallet } = useUserStore();
  const { userRewards, loadUserRewards } = useRewardsStore();
  const [activeQRSheet, setActiveQRSheet] = useState<QRSheetType>(null);

  useEffect(() => {
    loadUserRewards();
  }, []);

  const unusedVoucherCount = userRewards.filter((v) => v.usedAt === null).length;
  const isVehicleApproved = pointWallet?.vehicleStatus === 'Approved';
  const activeConfig = activeQRSheet ? QR_SHEET_CONFIG[activeQRSheet] : null;

  return (
    <Box className="py-7">
      <MemberCard />

      {user && !isVehicleApproved && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        items={[
          {
            icon: <Gift size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Voucher của bạn',
            sub: unusedVoucherCount > 0 ? `${unusedVoucherCount} voucher chưa dùng` : 'Chưa có voucher',
            onPress: () => navigate('/my-vouchers'),
          },
          ...(isVehicleApproved ? [{
            icon: <Car size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'Thông tin xe của tôi',
            sub: 'Xe điện đã được xác thực',
            onPress: () => navigate('/vehicle-info'),
          }] : []),
        ]}
      />

      <SectionList
        title="QR Code"
        items={[
          {
            icon: <QrCode size={ICON_SIZE} color={ICON_COLOR} />,
            label: 'QR Code của tôi',
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
  const { loadUserRewards } = useRewardsStore();

  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <PullToRefresh
        onRefresh={async () => { await Promise.all([loadPointWallet(), loadUserRewards()]); }}
        className="flex-1"
      >
        <Personal />
      </PullToRefresh>
    </Page>
  );
};

export default ProfilePage;
