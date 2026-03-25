import React, { FC, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Box, Icon } from 'zmp-ui';
import { Navigation } from './navigation';
import HomePage from 'pages/index';
import ProfilePage from 'pages/profile';
import RewardsPage from 'pages/rewards';
import RewardDetailPage from 'pages/rewards/detail';
import CategoryDetailPage from 'pages/rewards/category-detail';
import QRCodePage from 'pages/qr-code';
import StoresPage from 'pages/stores';
import StoreDetailPage from 'pages/store-detail';
import RegisterPage from 'pages/register';
import MyVouchersPage from 'pages/my-vouchers';
import { getSystemInfo } from 'zmp-sdk';
import { ScrollRestoration } from './scroll-restoration';
import { useUserStore } from 'stores/user';
import { useSnackbarInit } from 'hooks/use-snackbar-init';
import { ProtectedRoute } from './protected-route';
import { getZaloAccessToken } from 'helpers/user';

if (import.meta.env.DEV) {
  document.body.style.setProperty('--zaui-safe-area-inset-top', '24px');
} else if (getSystemInfo().platform === 'android') {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    '--zaui-safe-area-inset-top',
    `${androidSafeTop}px`,
  );
}

// Routes không hiển thị back icon (root tabs)
const ROOT_ROUTES = ['/', '/rewards', '/qr-code', '/stores', '/profile'];

const isRootRoute = (pathname: string) => ROOT_ROUTES.includes(pathname);

// ─── App Header ───────────────────────────────────────────────────────────────

const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !isRootRoute(location.pathname);

  return (
    <Box
      className="bg-white flex-shrink-0 flex items-center"
      style={{
        paddingTop: 'var(--zaui-safe-area-inset-top, 0px)',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 12,
        minHeight: 'calc(var(--zaui-safe-area-inset-top, 0px) + 52px)',
      }}
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1 flex-shrink-0 mr-2"
        >
          <Icon icon="zi-chevron-left" />
        </button>
      )}
    </Box>
  );
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Layout: FC = () => {
  const { authLoading, initializeAuth } = useUserStore();
  useSnackbarInit();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    async function fetchToken() {
      const zaloAccessToken = await getZaloAccessToken();
      console.log('Zalo Access Token:', zaloAccessToken);
    }
    fetchToken();
  }, []);

  if (authLoading) {
    return (
      <Box
        flex
        flexDirection="column"
        className="h-screen items-center justify-center"
      >
        <Box className="text-center">
          <div className="text-lg font-semibold">Đang tải...</div>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <AppHeader />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rewards — category phải đứng trước :id để tránh match nhầm */}
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards/category/:category"
            element={
              <ProtectedRoute>
                <CategoryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards/:id"
            element={
              <ProtectedRoute>
                <RewardDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qr-code"
            element={
              <ProtectedRoute>
                <QRCodePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <StoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores/:id"
            element={
              <ProtectedRoute>
                <StoreDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-vouchers"
            element={
              <ProtectedRoute>
                <MyVouchersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
