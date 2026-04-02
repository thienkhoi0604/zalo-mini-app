import React, { FC, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { ChevronLeft } from 'lucide-react';
import background from '@/assets/images/background.png';
import { Navigation } from './navigation';
import HomePage from '@/pages/index';
import ProfilePage from '@/pages/profile';
import VouchersPage from '@/pages/vouchers';
import VoucherDetailPage from '@/pages/vouchers/detail';
import CategoryDetailPage from '@/pages/vouchers/category-feed';
import StoreDetailPage from '@/pages/vouchers/store-detail';
import QRCodePage from '@/pages/qr-code';
import StationsPage from '@/pages/stations';
import StationDetailPage from '@/pages/station-detail';
import RegisterPage from '@/pages/register';
import MyVouchersPage from '@/pages/my-vouchers';
import MyVoucherDetailPage from '@/pages/my-vouchers/voucher-detail';
import RankBenefitsPage from '@/pages/rank-benefits';
import CheckinHistoryPage from '@/pages/checkin-history';
import VerifyVehiclePage from '@/pages/verify-vehicle';
import VehicleInfoPage from '@/pages/vehicle-info';
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

// Routes that do not show a back button
const NO_BACK_ROUTES = ['/', '/rewards', '/qr-code', '/stations', '/profile', '/register'];

const showBackButton = (pathname: string) => !NO_BACK_ROUTES.includes(pathname);

const getRouteTitle = (pathname: string): string => {
  if (pathname === '/profile') return '';
  if (pathname === '/') return 'Trang chủ';
  if (pathname === '/rewards') return 'Voucher';
  if (pathname === '/stations') return 'Trạm sạc';
  if (pathname === '/qr-code') return 'Mã QR';
  if (pathname === '/register') return 'Đăng nhập';
  if (pathname === '/my-vouchers') return 'Voucher của tôi';
  if (pathname.startsWith('/my-vouchers/')) return 'Chi tiết voucher';
  if (pathname === '/rank-benefits') return 'Đặc quyền';
  if (pathname === '/checkin-history') return 'Lịch sử điểm';
  if (pathname === '/verify-vehicle') return 'Xác thực xe';
  if (pathname === '/vehicle-info') return 'Thông tin xe';
  if (pathname.startsWith('/rewards/category/'))
    return decodeURIComponent(pathname.replace('/rewards/category/', ''));
  if (pathname.startsWith('/rewards/')) return 'Chi tiết voucher';
  if (pathname.startsWith('/stations/')) return 'Chi tiết trạm sạc';
  if (pathname.startsWith('/stores/')) return 'Cửa hàng';
  return '';
};

// ─── App Header ───────────────────────────────────────────────────────────────

const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = showBackButton(location.pathname);
  const title = getRouteTitle(location.pathname);

  return (
    <Box
      className="flex-shrink-0"
      style={{
        // background: 'linear-gradient(160deg, rgb(238, 247, 241) 0%',
        paddingTop: 'var(--zaui-safe-area-inset-top, 0px)',
        minHeight: showBack
          ? 'calc(var(--zaui-safe-area-inset-top, 0px) + 56px)'
          : 'calc(var(--zaui-safe-area-inset-top, 0px) + 60px)',
      }}
    >
      {(showBack || title) && (
        <Box
          flex
          className="items-center"
          style={{
            height: 56,
            paddingLeft: 10,
            paddingRight: 16,
            position: 'relative',
          }}
        >
          {/* Back button */}
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(40,143,78,0.12)',
                cursor: 'pointer',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <ChevronLeft size={20} color="#1A6B38" strokeWidth={2.5} />
            </button>
          )}

          {/* Title — centered */}
          {title && (
            <p
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: '#1A6B38',
                letterSpacing: 0.2,
                pointerEvents: 'none',
              }}
            >
              {title}
            </p>
          )}
        </Box>
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
          <Route path="/rewards/category/:category" element={<CategoryDetailPage />} />
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
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
