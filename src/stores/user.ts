import { create } from 'zustand';
import { getUserInfo } from 'zmp-sdk';
import { getAccessToken as getAccessTokenZalo } from 'zmp-sdk/apis';

import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  refreshTokens,
  fetchUserInfo,
} from 'apis/authorization';
import { User } from '@/types/user';

type UserStore = {
  user: User | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  qrCodeUrl: string | null;
  qrLoading: boolean;

  initializeAuth: () => Promise<void>;
  loginWithZalo: () => Promise<'success' | 'permission_denied'>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  loadQRCode: () => Promise<void>;
  scanQRCode: (scannedUserId: string) => Promise<number>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  authLoading: false,
  isAuthenticated: false,
  qrCodeUrl: null,
  qrLoading: false,

  /**
   * Chạy khi app khởi động (Layout.tsx).
   * Nếu đã có JWT token hợp lệ → fetch thông tin user → tự đăng nhập.
   * Nếu không có hoặc token hết hạn → để nguyên, không redirect.
   */
  initializeAuth: async () => {
    set({ authLoading: true });
    try {
      const token = getAccessToken();
      if (!token) {
        set({ authLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const user = await fetchUserInfo();
      set({ user, isAuthenticated: true, authLoading: false });
    } catch (error) {
      // Token hết hạn hoặc không hợp lệ → clear và để user đăng ký lại
      console.error('Auto-login failed:', error);
      clearTokens();
      set({ authLoading: false, isAuthenticated: false, user: null });
    }
  },

  /**
   * Chạy khi user bấm nút "Đăng ký" lần đầu.
   * 1. Xin quyền và lấy thông tin Zalo (autoRequestPermission: true)
   * 2. Nếu user từ chối → trả về 'permission_denied', KHÔNG throw
   * 3. Nếu cho phép → lấy accessToken → gọi API đăng ký/đăng nhập
   */
  loginWithZalo: async () => {
    set({ authLoading: true });
    try {
      // Bước 1: Xin quyền lấy thông tin Zalo
      let zaloAccessToken: string | null = null;
      try {
        await getUserInfo({ autoRequestPermission: true });
        zaloAccessToken = await getAccessTokenZalo();
      } catch (permissionError) {
        // User từ chối cấp quyền
        console.warn('Zalo permission denied:', permissionError);
        set({ authLoading: false });
        return 'permission_denied';
      }

      if (!zaloAccessToken) {
        console.warn(
          'Could not retrieve Zalo access token after permission granted',
        );
        set({ authLoading: false });
        return 'permission_denied';
      }

      // Bước 2: Đăng ký / đăng nhập với backend
      const user = await loginWithZaloUser(zaloAccessToken);
      set({ user, isAuthenticated: true, authLoading: false });
      return 'success';
    } catch (error) {
      console.error('Login failed:', error);
      set({ authLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  refreshAuthToken: async () => {
    try {
      await refreshTokens();
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().logout();
      throw error;
    }
  },

  loadQRCode: async () => {
    const state = get();
    if (!state.user?.id) return;

    set({ qrLoading: true });
    try {
      const { data } = await (
        await import('apis/client')
      ).default.get(`/users/${state.user.id}/qr-code`);
      set({ qrCodeUrl: data.qrCodeUrl, qrLoading: false });
    } catch (error) {
      console.error('Failed to load QR code:', error);
      set({ qrLoading: false });
      throw error;
    }
  },

  scanQRCode: async (scannedUserId: string) => {
    try {
      const { data } = await (
        await import('apis/client')
      ).default.post('/qr-code/scan', { scannedUserId });

      if (data.totalPoints !== undefined) {
        const state = get();
        if (state.user) {
          set({ user: { ...state.user, points: data.totalPoints } });
        }
      }

      return data.points || 0;
    } catch (error) {
      console.error('Failed to scan QR code:', error);
      throw error;
    }
  },
}));
