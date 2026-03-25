import React, { FC, useEffect } from 'react';
import { Box, Page } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { useToBeImplemented } from 'hooks';
import { useUserStore } from 'stores/user';
import { useGiftCardsStore } from 'stores/gift-cards';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { userGiftCards, loadUserGiftCards } = useGiftCardsStore();

  useEffect(() => {
    loadUserGiftCards();
  }, []);

  const unusedCount = userGiftCards.filter((v) => v.status === 'received').length;

  return (
    <Box className="py-7">
      <MemberCard />

      {user && !user.verified && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        onClick={() => navigate('/my-vouchers')}
        items={[
          {
            icon: 'zi-gift',
            label: 'Voucher của bạn',
            sub: unusedCount > 0 ? `${unusedCount} voucher chưa dùng` : 'Chưa có voucher',
          },
        ]}
      />

      <SectionList
        title="Dành cho bạn"
        onClick={onClick}
        items={[
          { icon: 'zi-user-circle', label: 'Giới thiệu khách hàng' },
          { icon: 'zi-user-add', label: 'Giới thiệu bạn bè tải ứng dụng' },
        ]}
      />
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
