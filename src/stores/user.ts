import { create } from 'zustand';
import { getUserInfo } from 'zmp-sdk';
import { getAccessToken as getAccessTokenZalo } from 'zmp-sdk/apis';

import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
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
  /** Dùng nội bộ bởi client.ts interceptor khi refresh token thất bại */
  setUnauthenticated: () => void;
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
   *
   * - Có token → gọi /auth/me để lấy thông tin user mới nhất
   * - Không có token → chưa đăng ký, để nguyên
   * - /auth/me thất bại do token hết hạn → axiosClient interceptor tự refresh.
   *   Nếu refresh cũng fail → clearTokens + để user đăng ký lại
   */
  initializeAuth: async () => {
    set({ authLoading: true });
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        set({ authLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const user = await fetchUserInfo();
      set({ user, isAuthenticated: true, authLoading: false });
    } catch (error) {
      // Token hết hạn và refresh cũng fail → bắt đăng ký lại
      console.error('Auto-login failed:', error);
      clearTokens();
      set({ authLoading: false, isAuthenticated: false, user: null });
    }
  },

  /**
   * Chạy khi user bấm "Đăng ký" lần đầu.
   * 1. Xin quyền Zalo (autoRequestPermission: true)
   * 2. User từ chối → trả về 'permission_denied', không throw
   * 3. Cho phép → lấy accessToken Zalo → gọi API → lưu tokens
   */
  loginWithZalo: async () => {
    set({ authLoading: true });
    try {
      let zaloAccessToken: string | null = null;
      try {
        const user = await getUserInfo({ autoRequestPermission: true });
        zaloAccessToken = await getAccessTokenZalo();
        console.log('Zalo user info:', user);
        console.log('zaloAccessToken: ', zaloAccessToken);
      } catch (permissionError) {
        console.warn('Zalo permission denied:', permissionError);
        set({ authLoading: false });
        return 'permission_denied';
      }

      if (!zaloAccessToken) {
        set({ authLoading: false });
        return 'permission_denied';
      }

      const user = await loginWithZaloUser(zaloAccessToken);
      set({ user, isAuthenticated: true, authLoading: false });
      return 'success';
    } catch (error) {
      console.error('Login failed:', error);
      set({ authLoading: false });
      throw error;
    }
  },

  setUnauthenticated: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
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
