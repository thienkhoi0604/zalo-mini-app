import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Page, useSnackbar } from 'zmp-ui';
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
    <Page>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
        <button
          onClick={handleRegister}
          disabled={authLoading}
          className="w-full max-w-xs py-3.5 rounded-xl bg-green-500 text-white font-semibold text-base shadow-md active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ color: '#ffffff', backgroundColor: '#22c55e' }}
        >
          {authLoading ? 'Đang xử lý...' : 'Đăng nhập EcoGreen Coin'}
        </button>
      </div>
    </Page>
  );
};

export default RegisterPage;
