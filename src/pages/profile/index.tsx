import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Gift, QrCode, ShieldCheck, History, Car } from 'lucide-react';
import { useToBeImplemented } from '@/hooks';
import { useUserStore } from '@/stores/user';
import { useRewardsStore } from '@/stores/rewards';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';
import QRCodeSheet from './qr-code-sheet';
import PullToRefresh from '@/components/pull-to-refresh';

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const navigate = useNavigate();
  const { user, pointWallet, loadPointWallet } = useUserStore();
  const { userRewards, loadUserRewards } = useRewardsStore();
  const [qrSheetVisible, setQrSheetVisible] = useState(false);

  useEffect(() => {
    loadUserRewards();
  }, []);

  const unusedCount = userRewards.filter((v) => v.usedAt === null).length;

  return (
    <Box className="py-7">
      <MemberCard />

      {user && pointWallet?.vehicleStatus !== 'Approved' && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        items={[
          {
            icon: <Gift size={18} color="#A0784A" />,
            label: 'Voucher của bạn',
            sub: unusedCount > 0 ? `${unusedCount} voucher chưa dùng` : 'Chưa có voucher',
            onPress: () => navigate('/my-vouchers'),
          },
          ...(pointWallet?.vehicleStatus === 'Approved' ? [{
            icon: <Car size={18} color="#A0784A" />,
            label: 'Thông tin xe của tôi',
            sub: 'Xe điện đã được xác thực',
            onPress: () => navigate('/vehicle-info'),
          }] : []),
        ]}
      />

      <SectionList
        title="QR Code"
        onClick={() => setQrSheetVisible(true)}
        items={[
          { icon: <QrCode size={18} color="#A0784A" />, label: 'QR Code của tôi', sub: 'Mã giới thiệu cho người dùng' },
        ]}
      />

      <SectionList
        title="Dành cho bạn"
        items={[
          {
            icon: <ShieldCheck size={18} color="#A0784A" />,
            label: 'Quyền lợi xếp hạng',
            sub: user?.rank?.currentRankName ? `Hạng ${user.rank.currentRankName}` : undefined,
            onPress: () => navigate('/rank-benefits'),
          },
          {
            icon: <History size={18} color="#A0784A" />,
            label: 'Lịch sử điểm',
            sub: 'Xem các lần check-in tích điểm',
            onPress: () => navigate('/checkin-history'),
          },
        ]}
      />

      <QRCodeSheet visible={qrSheetVisible} onClose={() => setQrSheetVisible(false)} />
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
