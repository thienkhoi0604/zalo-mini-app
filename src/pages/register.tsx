import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Box, Button, Page, Text, useSnackbar } from 'zmp-ui';
import { useUserStore } from 'stores/user';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const { openSnackbar } = useSnackbar();

  const { authLoading, isAuthenticated } = useUserStore();

  const from = location?.state?.from || '/profile';

  const handleRegister = async () => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }

    try {
      const result = await useUserStore.getState().loginWithZalo();

      if (result === 'permission_denied') {
        openSnackbar({
          text: 'Bạn cần cấp quyền Zalo để đăng nhập.',
          type: 'warning',
        });
        return;
      }

      openSnackbar({ text: 'Đăng nhập thành công!', type: 'success' });
      navigate(from, { replace: true });
    } catch {
      openSnackbar({
        text: 'Đăng nhập thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    }
  };

  return (
    <Page className="bg-white">
      <Box className="p-6 space-y-4">
        <Text.Title className="font-bold">Đăng nhập</Text.Title>
        <Text className="text-sm text-gray-700">
          Bạn cần đăng nhập để sử dụng các chức năng của hệ thống (QR Code, Thẻ
          quà tặng, Cửa hàng, Tài khoản...).
        </Text>

        <Box className="pt-2">
          <Button
            fullWidth
            onClick={handleRegister}
            loading={authLoading}
            disabled={authLoading}
          >
            {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default RegisterPage;
