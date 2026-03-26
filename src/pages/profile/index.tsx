import React, { FC, useEffect, useState } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { Gift, QrCode, UserCircle2, UserPlus } from 'lucide-react';
import { useToBeImplemented } from 'hooks';
import { useUserStore } from 'stores/user';
import { useRewardsStore } from 'stores/rewards';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';
import QRCodeSheet from './qr-code-sheet';

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { userRewards, loadUserRewards } = useRewardsStore();
  const [qrSheetVisible, setQrSheetVisible] = useState(false);

  useEffect(() => {
    loadUserRewards();
  }, []);

  const unusedCount = userRewards.filter((v) => v.usedAt === null).length;

  return (
    <Box className="py-7">
      <MemberCard />

      {user && !user.verified && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        onClick={() => navigate('/my-vouchers')}
        items={[
          {
            icon: <Gift size={18} color="#A0784A" />,
            label: 'Voucher của bạn',
            sub: unusedCount > 0 ? `${unusedCount} voucher chưa dùng` : 'Chưa có voucher',
          },
        ]}
      />

      <SectionList
        title="QR Code"
        onClick={() => setQrSheetVisible(true)}
        items={[
          { icon: <QrCode size={18} color="#A0784A" />, label: 'QR Code của tôi', sub: 'Cho người khác quét để kiếm điểm' },
        ]}
      />

      <SectionList
        title="Dành cho bạn"
        onClick={onClick}
        items={[
          { icon: <UserCircle2 size={18} color="#A0784A" />, label: 'Giới thiệu khách hàng' },
          { icon: <UserPlus size={18} color="#A0784A" />, label: 'Giới thiệu bạn bè tải ứng dụng' },
        ]}
      />

      <QRCodeSheet visible={qrSheetVisible} onClose={() => setQrSheetVisible(false)} />
    </Box>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

const ProfilePage: FC = () => {
  return (
    <Page className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
      <Personal />
    </Page>
  );
};

export default ProfilePage;
