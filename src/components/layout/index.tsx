import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Box } from 'zmp-ui';
import background from '@/assets/images/background.png';
import { Navigation } from './navigation';
import AppHeader from './app-header';
import HomePage from '@/pages/home';
import ProfilePage from '@/pages/profile';
import VouchersPage from '@/pages/rewards';
import VoucherDetailPage from '@/pages/rewards/detail';
import StoreItemDetailPage from '@/pages/rewards/store-item-detail';
import CategoryDetailPage from '@/pages/rewards/category-feed';
import StoreDetailPage from '@/pages/stores/detail';
import StoresPage from '@/pages/stores';
import QRCodePage from '@/pages/qr-code';
import StationsPage from '@/pages/stations';
import StationDetailPage from '@/pages/stations/detail';
import RegisterPage from '@/pages/auth';
import MyVouchersPage from '@/pages/my-vouchers';
import MyVoucherDetailPage from '@/pages/my-vouchers/voucher-detail';
import RankBenefitsPage from '@/pages/ranks';
import VouchersListPage from '@/pages/rewards/all-list';
import CheckinHistoryPage from '@/pages/checkins';
import VerifyVehiclePage from '@/pages/vehicle/verify';
import VehicleInfoPage from '@/pages/vehicle/info';
import PolicyPage from '@/pages/policy';
import { getSystemInfo } from 'zmp-sdk';
import { ScrollRestoration } from './scroll-restoration';
import { useUserStore } from '@/store/user';
import { useSnackbarInit } from '@/hooks/use-snackbar-init';
import { ProtectedRoute } from '@/components/routing/protected-route';

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

// ─── Layout ───────────────────────────────────────────────────────────────────

export const Layout: FC = () => {
  const { authLoading, initializeAuth } = useUserStore();
  useSnackbarInit();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
    <Box
      flex
      flexDirection="column"
      className="h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <ScrollRestoration />
      <AppHeader />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rewards — category phải đứng trước :id để tránh match nhầm */}
          <Route path="/rewards" element={<VouchersPage />} />
          <Route path="/rewards/category/:categoryId" element={<CategoryDetailPage />} />
          {/* /rewards/all must come before /rewards/:id to avoid matching "all" as an id */}
          <Route path="/rewards/all" element={<VouchersListPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route
            path="/stores/:storeId"
            element={
              <ProtectedRoute>
                <StoreDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards/:id"
            element={
              <ProtectedRoute>
                <VoucherDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <StoreItemDetailPage />
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
            path="/stations"
            element={
              <ProtectedRoute>
                <StationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stations/:id"
            element={
              <ProtectedRoute>
                <StationDetailPage />
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
          <Route
            path="/my-vouchers/:id"
            element={
              <ProtectedRoute>
                <MyVoucherDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rank-benefits"
            element={
              <ProtectedRoute>
                <RankBenefitsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkin-history"
            element={
              <ProtectedRoute>
                <CheckinHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-vehicle"
            element={
              <ProtectedRoute>
                <VerifyVehiclePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-info"
            element={
              <ProtectedRoute>
                <VehicleInfoPage />
              </ProtectedRoute>
            }
          />
          <Route path="/policy" element={<PolicyPage />} />
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
