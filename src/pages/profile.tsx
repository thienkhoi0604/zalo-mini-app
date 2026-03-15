import React, { FC, useState } from "react";
import { Box, Header, Icon, Page, Text, useSnackbar } from "zmp-ui";
import subscriptionDecor from "static/subscription-decor.svg";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import { useUserStore } from "stores/user";

const Subscription: FC = () => {
  const { zaloUser, zaloAccessToken, loadZaloUser, authLoading, isAuthenticated } = useUserStore();
  const { openSnackbar } = useSnackbar();
  const [loginError, setLoginError] = useState<string | null>(null);

  const requestUserInfo = async () => {
    if (isAuthenticated) return; // Already logged in

    setLoginError(null);
    if (!zaloUser || !zaloAccessToken) {
      try {
        await loadZaloUser();
      } catch (error) {
        const errorMsg = "Không thể lấy thông tin Zalo";
        setLoginError(errorMsg);
        openSnackbar({ text: errorMsg, type: "error" });
      }
    }

    try {
      // Use the store's loginWithZalo method with access token
      const store = useUserStore.getState();
      const userToUse = zaloUser || store.zaloUser;
      const tokenToUse = zaloAccessToken || store.zaloAccessToken;

      if (!userToUse || !tokenToUse) {
        throw new Error("Missing Zalo user info or access token");
      }

      await store.loginWithZalo(userToUse, tokenToUse);
      openSnackbar({ text: "Đăng nhập thành công!", type: "success" });
    } catch (error) {
      const errorMsg = "Đăng nhập thất bại. Vui lòng thử lại.";
      setLoginError(errorMsg);
      openSnackbar({ text: errorMsg, type: "error" });
    }
  };

  if (isAuthenticated) {
    return null; // Hide subscription section if already logged in
  }

  return (
    <Box className="m-4">
      <Box
        onClick={requestUserInfo}
        className="cursor-pointer bg-green text-white rounded-xl p-4 space-y-2 transition-opacity hover:opacity-80"
        style={{
          backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">
          {authLoading ? "Đang đăng nhập..." : "Đăng ký thành viên"}
        </Text.Title>
        <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>
      {loginError && (
        <Box className="mt-2 p-2 bg-red-100 rounded text-red-700 text-sm">
          {loginError}
        </Box>
      )}
    </Box>
  );
};

const Personal: FC = () => {
  const onClick = useToBeImplemented();
  const { backendUser, logout } = useUserStore();
  const { openSnackbar } = useSnackbar();

  const handleLogout = () => {
    logout();
    openSnackbar({ text: "Đã đăng xuất", type: "success" });
  };

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
            left: <Icon icon="zi-call" />,
            right: (
              <Box
                flex
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="cursor-pointer"
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
        ].filter(Boolean) as Parameters<typeof ListRenderer>[0]["items"]}
        renderLeft={(item: any) => item.left}
        renderRight={(item: any) => item.right}
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
