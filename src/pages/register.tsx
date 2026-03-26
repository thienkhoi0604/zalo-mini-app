import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Page, useSnackbar } from 'zmp-ui';
import { useUserStore } from '@/stores/user';

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
          text: 'Bạn cần cấp quyền để đăng nhập.',
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
    <Page className="flex flex-col overflow-hidden" style={{ height: '100%' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          height: '100%',
        }}
      >
        <button
          onClick={handleRegister}
          disabled={authLoading}
          className="w-full active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            maxWidth: 320,
            padding: '14px 0',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #2D9E58 0%, #1A6B38 100%)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(45,158,88,0.35)',
          }}
        >
          {authLoading ? 'Đang xử lý...' : 'Đăng nhập EcoGreen Coin'}
        </button>
      </div>
    </Page>
  );
};

export default RegisterPage;
