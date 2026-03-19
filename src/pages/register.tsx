import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Button, Page, Text, useSnackbar } from "zmp-ui";
import { useUserStore } from "stores/user";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const { openSnackbar } = useSnackbar();

  const { authLoading, isAuthenticated } = useUserStore();

  const from = location?.state?.from || "/profile";

  const handleRegister = async () => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }

    try {
      // BE chưa sẵn sàng: loginWithZalo hiện đang đọc mock data từ
      // `mock/auth-login-response.json` ở layer API, nên chỉ cần gọi với token giả.
      await useUserStore.getState().loginWithZalo("mock-access-token");
      openSnackbar({ text: "Đăng ký thành công!", type: "success" });
      navigate(from, { replace: true });
    } catch {
      openSnackbar({ text: "Đăng ký thất bại. Vui lòng thử lại.", type: "error" });
    }
  };

  return (
    <Page className="bg-white">
      <Box className="p-6 space-y-4">
        <Text.Title className="font-bold">Đăng ký thành viên</Text.Title>
        <Text className="text-sm text-gray-700">
          Bạn cần đăng ký để sử dụng các chức năng của hệ thống (QR Code, Thẻ quà
          tặng, Cửa hàng, Tài khoản...).
        </Text>

        <Box className="pt-2">
          <Button
            fullWidth
            onClick={handleRegister}
            loading={authLoading}
            disabled={authLoading}
          >
            {authLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default RegisterPage;

