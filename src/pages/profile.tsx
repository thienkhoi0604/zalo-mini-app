import React, { FC } from "react";
import { Box, Header, Icon, Page, Text } from "zmp-ui";
import subscriptionDecor from "static/subscription-decor.svg";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import { useUserStore } from "stores/user";
import { loginWithZaloUser, clearTokens } from "apis/authorization";

const Subscription: FC = () => {
  const { zaloUser, loadZaloUser, setBackendUser } = useUserStore();

  const requestUserInfo = async () => {
    if (!zaloUser) {
      await loadZaloUser();
    }
    try {
      const backendUser = await loginWithZaloUser(zaloUser);
      setBackendUser(backendUser);
      console.warn("Đã đăng nhập và mapping user với backend", {
        zaloUser,
        backendUser,
      });
    } catch (e) {
      console.error("Login backend thất bại", e);
    }
  };

  return (
    <Box className="m-4" onClick={requestUserInfo}>
      <Box
        className="bg-green text-white rounded-xl p-4 space-y-2"
        style={{
          backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">Đăng ký thành viên</Text.Title>
        <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>
    </Box>
  );
};

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const backendUser = useUserStore((s) => s.backendUser);
  const setBackendUser = useUserStore((s) => s.setBackendUser);

  return (
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
                  {backendUser?.displayName || "Đăng nhập tài khoản"}
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          backendUser && {
            left: <Icon icon="zi-logout" />,
            right: (
              <Box
                flex
                onClick={() => {
                  clearTokens();
                  setBackendUser(null);
                }}
              >
                <Text.Header className="flex-1 items-center font-normal">
                  Đăng xuất
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
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ].filter(Boolean)}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other: FC = () => {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Khác"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-star" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Đánh giá đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Liên hệ và góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const ProfilePage: FC = () => {
  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Subscription />
      <Personal />
      <Other />
    </Page>
  );
};

export default ProfilePage;
