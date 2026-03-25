import React, { FC } from 'react';
import { Box, Page } from 'zmp-ui';
import { useToBeImplemented } from 'hooks';
import { useUserStore } from 'stores/user';
import AppHeader from 'components/app-header';
import MemberCard from './member-card';
import UnverifiedBanner from './unverified-banner';
import SectionList from './section-list';

// ─── Personal ────────────────────────────────────────────────────────────────

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const { user } = useUserStore();

  return (
    <Box className="py-7">
      <MemberCard />

      {user && !user.verified && <UnverifiedBanner />}

      <SectionList
        title="Tiện ích"
        onClick={onClick}
        items={[
          { icon: 'zi-gift', label: 'Voucher của bạn', sub: '0 voucher' },
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
      <AppHeader title="" showGreeting />
      <Personal />
    </Page>
  );
};

export default ProfilePage;
