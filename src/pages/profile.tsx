import React, { FC } from "react";
import { Box, Header, Icon, Page, Text, useSnackbar } from "zmp-ui";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import { useUserStore } from "stores/user";
import MyGiftCardsSection from "./my-gift-cards-section";

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const { user, logout } = useUserStore();
  const { openSnackbar } = useSnackbar();

  const handleLogout = () => {
    logout();
    openSnackbar({ text: "Đã đăng xuất", type: "success" });
  };

  return (
    <>
      <Box className="m-4">
        <ListRenderer
          title="Cá nhân"
          onClick={onClick}
          items={[
            {
              left: <Icon icon="zi-user" />,
              right: (
                <Box flex>
                  <Text.Header className="flex-1 items-center font-normal">
                    {user?.displayName || "Thông tin cá nhân"}
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
          ].filter(Boolean) as Parameters<typeof ListRenderer>[0]["items"]}
          renderLeft={(item: any) => item.left}
          renderRight={(item: any) => item.right}
        />
      </Box>

      {/* Points Section */}
      {user && (
        <Box className="m-4 grid grid-cols-2 gap-3">
          {/* Accumulation Points */}
          <Box className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white shadow">
            <Text className="text-xs font-medium opacity-90">Điểm Tích Lũy</Text>
            <Text.Title className="text-3xl font-bold mt-2">
              {user.points || 0}
            </Text.Title>
            <Text className="text-xs opacity-75 mt-1">Dùng để đổi thẻ quà</Text>
          </Box>

          {/* Rating Points */}
          <Box className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow">
            <Text className="text-xs font-medium opacity-90">Điểm Xếp Hạng</Text>
            <Text.Title className="text-3xl font-bold mt-2">
              {user.ratingPoints || 0}
            </Text.Title>
            <Text className="text-xs opacity-75 mt-1">Đánh giá mức độ</Text>
          </Box>
        </Box>
      )}

      {/* My Gift Cards Section */}
      <MyGiftCardsSection />
    </>
  );
};

const ProfilePage: FC = () => {
  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Personal />
    </Page>
  );
};

export default ProfilePage;
