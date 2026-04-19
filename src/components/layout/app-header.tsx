import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Box } from 'zmp-ui';
import { ChevronLeft } from 'lucide-react';

// Routes that do not show a back button
const NO_BACK_ROUTES = ['/', '/rewards', '/qr-code', '/stations', '/profile', '/register'];

const showBackButton = (pathname: string) => !NO_BACK_ROUTES.includes(pathname);

export const getRouteTitle = (pathname: string): string => {
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
  if (pathname === '/policy') return 'Khái niệm & Điều khoản';
  if (pathname.startsWith('/rewards/category/')) return 'Danh mục';
  if (pathname.startsWith('/products/')) return 'Chi tiết sản phẩm';
  if (pathname.startsWith('/rewards/')) return 'Chi tiết voucher';
  if (pathname.startsWith('/stations/')) return 'Chi tiết trạm sạc';
  if (pathname === '/rewards/all') return 'Danh sách voucher';
  if (pathname === '/stores') return 'Danh sách cửa hàng';
  if (pathname.startsWith('/stores/')) return 'Cửa hàng';
  return '';
};

const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = showBackButton(location.pathname);
  const title = getRouteTitle(location.pathname);

  return (
    <Box
      className="flex-shrink-0"
      style={{
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
                background: location.pathname === '/rank-benefits'
                  ? '#fff'
                  : 'rgba(40,143,78,0.12)',
                cursor: 'pointer',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <ChevronLeft size={20} color="#1A6B38" strokeWidth={2.5} />
            </button>
          )}

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

export default AppHeader;
