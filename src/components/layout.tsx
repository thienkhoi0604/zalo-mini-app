import React, { FC, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import { Navigation } from "./navigation";
import HomePage from "pages/index";
import CategoryPage from "pages/category";
import CartPage from "pages/cart";
import NotificationPage from "pages/notification";
import ProfilePage from "pages/profile";
import SearchPage from "pages/search";
import CheckoutResultPage from "pages/result";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import { useHandlePayment } from "hooks";
import { useUserStore, startTokenRefreshInterval, stopTokenRefreshInterval } from "stores/user";
import { ProtectedRoute } from "./protected-route";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  useHandlePayment();
  const { authLoading, initializeAuth } = useUserStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    startTokenRefreshInterval();

    return () => {
      stopTokenRefreshInterval();
    };
  }, [initializeAuth]);

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <Box flex flexDirection="column" className="h-screen items-center justify-center">
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
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/search" element={<SearchPage />}></Route>
          <Route path="/category" element={<CategoryPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/notification" element={<ProtectedRoute element={<NotificationPage />} />}></Route>
          <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />}></Route>
          <Route path="/result" element={<ProtectedRoute element={<CheckoutResultPage />} />}></Route>
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
