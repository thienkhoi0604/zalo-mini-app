import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Box } from 'zmp-ui';
import { Navigation } from './navigation';
import HomePage from 'pages/index';
import ProfilePage from 'pages/profile';
import GiftCardsPage from 'pages/gift-cards';
import GiftCardDetailPage from 'pages/gift-cards/detail';
import CategoryDetailPage from 'pages/gift-cards/category-detail';
import QRCodePage from 'pages/qr-code';
import StoresPage from 'pages/stores';
import StoreDetailPage from 'pages/store-detail';
import RegisterPage from 'pages/register';
import { getSystemInfo } from 'zmp-sdk';
import { ScrollRestoration } from './scroll-restoration';
import { useUserStore } from 'stores/user';
import { useSnackbarInit } from 'hooks/use-snackbar-init';
import { ProtectedRoute } from './protected-route';
import { getAccessToken as getAccessTokenZalo } from 'zmp-sdk/apis';

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

export const Layout: FC = () => {
  const { authLoading, initializeAuth } = useUserStore();
  useSnackbarInit();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    async function fetchToken() {
      const zaloAccessToken = await getAccessTokenZalo();
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
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Gift Cards — category phải đứng trước :id để tránh match nhầm */}
          <Route
            path="/gift-cards"
            element={
              <ProtectedRoute>
                <GiftCardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gift-cards/category/:category"
            element={
              <ProtectedRoute>
                <CategoryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gift-cards/:id"
            element={
              <ProtectedRoute>
                <GiftCardDetailPage />
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
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
