import React, { FC } from 'react';
import { Box, Icon, Page, Text } from 'zmp-ui';
import { ListRenderer } from 'components/list-renderer';
import { useToBeImplemented } from 'hooks';
import { useUserStore } from 'stores/user';
import MyGiftCardsSection from './my-gift-cards-section';
import AppHeader from 'components/app-header';

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const { user } = useUserStore();

  return (
    <>
      <Box className="px-4 pt-4 pb-2">
        <p className="text-base font-semibold text-gray-900">Tài khoản</p>
      </Box>

      <Box className="mx-4 mb-4">
        <ListRenderer
          title="Cá nhân"
          onClick={onClick}
          items={[
            {
              left: <Icon icon="zi-user" />,
              right: (
                <Box flex>
                  <Text.Header className="flex-1 items-center font-normal">
                    {user?.fullName || 'Thông tin cá nhân'}
                  </Text.Header>
                  <Icon icon="zi-chevron-right" />
                </Box>
              ),
            },
            {
              left: <Icon icon="zi-clock-2" />,
              right: (
                <Box flex>
                  <Text.Header className="flex-1 items-center font-normal">
                    Lịch sử tích điểm
                  </Text.Header>
                  <Icon icon="zi-chevron-right" />
                </Box>
              ),
            },
          ]}
          renderLeft={(item: any) => item.left}
          renderRight={(item: any) => item.right}
        />
      </Box>

      {user && (
        <Box className="mx-4 grid grid-cols-2 gap-3">
          <Box className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white shadow">
            <Text className="text-xs font-medium opacity-90">
              Điểm Tích Lũy
            </Text>
            <Text.Title className="text-3xl font-bold mt-2">
              {user.points || 0}
            </Text.Title>
            <Text className="text-xs opacity-75 mt-1">Dùng để đổi thẻ quà</Text>
          </Box>
          <Box className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow">
            <Text className="text-xs font-medium opacity-90">
              Điểm Xếp Hạng
            </Text>
            <Text.Title className="text-3xl font-bold mt-2">
              {user.ratingPoints || 0}
            </Text.Title>
            <Text className="text-xs opacity-75 mt-1">Đánh giá mức độ</Text>
          </Box>
        </Box>
      )}

      <MyGiftCardsSection />
    </>
  );
};

const ProfilePage: FC = () => {
  return (
    <Page className="flex-1 flex flex-col bg-gray-50">
      <AppHeader title="" showGreeting />
      <Personal />
    </Page>
  );
};

export default ProfilePage;
