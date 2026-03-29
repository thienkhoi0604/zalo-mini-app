import { create } from 'zustand';
import { getUserInfo } from 'zmp-sdk';
import { getZaloAccessToken, getZaloLocationToken, requestLocationPermissionOnce, requestZaloPermissions } from '@/helpers/user';
import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from '@/apis/authorization';
import { fetchUserInfo, fetchPointWallet, scanQRCode as scanQRCodeApi } from '@/apis/user';
import { User } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';

type UserStore = {
  user: User | null;
  pointWallet: PointWallet | null;
  authLoading: boolean;
  isAuthenticated: boolean;

  initializeAuth: () => Promise<void>;
  loginWithZalo: () => Promise<'success' | 'permission_denied_info' | 'permission_denied_location'>;
  loadPointWallet: () => Promise<void>;
  setUnauthenticated: () => void;
  scanQRCode: (scannedUserId: string) => Promise<number>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  pointWallet: null,
  authLoading: false,
  isAuthenticated: false,

  initializeAuth: async () => {
    set({ authLoading: true });
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        set({ authLoading: false, isAuthenticated: false, user: null, pointWallet: null });
        return;
      }

      try {
        const zaloResult = await getUserInfo({ autoRequestPermission: false });
        if (!zaloResult?.userInfo?.id) {
          clearTokens();
          set({ authLoading: false, isAuthenticated: false, user: null, pointWallet: null });
          return;
        }
      } catch {
        clearTokens();
        set({ authLoading: false, isAuthenticated: false, user: null, pointWallet: null });
        return;
      }

      const [user, pointWallet] = await Promise.all([fetchUserInfo(), fetchPointWallet()]);
      set({ user, pointWallet, isAuthenticated: true, authLoading: false });
      requestLocationPermissionOnce();
    } catch (error) {
      console.error('Auto-login failed:', error);
      clearTokens();
      set({ authLoading: false, isAuthenticated: false, user: null, pointWallet: null });
    }
  },

  loginWithZalo: async () => {
    set({ authLoading: true });
    try {
      // Request both permissions via authorize
      const permission = await requestZaloPermissions();
      if (permission.status === 'denied_info') {
        set({ authLoading: false });
        return 'permission_denied_info';
      }
      if (permission.status === 'denied_location') {
        set({ authLoading: false });
        return 'permission_denied_location';
      }

      // Both granted — fetch tokens
      const zaloAccessToken = await getZaloAccessToken();
      const locationToken = await getZaloLocationToken().catch(() => undefined);

      await loginWithZaloUser(zaloAccessToken, locationToken);
      const [user, pointWallet] = await Promise.all([fetchUserInfo(), fetchPointWallet()]);
      set({ user, pointWallet, isAuthenticated: true, authLoading: false });
      return 'success';
    } catch (error) {
      console.error('Login failed:', error);
      set({ authLoading: false });
      throw error;
    }
  },

  loadPointWallet: async () => {
    try {
      const pointWallet = await fetchPointWallet();
      set({ pointWallet });
    } catch (error) {
      console.error('Failed to load point wallet:', error);
    }
  },

  setUnauthenticated: () => {
    clearTokens();
    set({ user: null, pointWallet: null, isAuthenticated: false });
  },

  scanQRCode: async (scannedUserId: string) => {
    try {
      const data = await scanQRCodeApi(scannedUserId);
      if (data.totalPoints !== undefined) {
        set((state) => ({
          pointWallet: state.pointWallet
            ? { ...state.pointWallet, currentBalance: data.totalPoints! }
            : null,
        }));
      }
      return data.points ?? 0;
    } catch (error) {
      console.error('Failed to scan QR code:', error);
      throw error;
    }
  },
}));
