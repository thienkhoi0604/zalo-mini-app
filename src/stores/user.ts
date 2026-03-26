import { create } from 'zustand';
import { getUserInfo } from 'zmp-sdk';
import { getZaloAccessToken, getZaloLocationToken } from '@/helpers/user';
import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from '@/apis/authorization';
import axiosClient from '@/apis/client';
import { fetchUserInfo, fetchPointWallet } from '@/apis/user';
import { User } from '@/types/user';
import { PointWallet } from '@/types/point-wallet';

type UserStore = {
  user: User | null;
  pointWallet: PointWallet | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  qrCodeUrl: string | null;
  qrLoading: boolean;

  initializeAuth: () => Promise<void>;
  loginWithZalo: () => Promise<'success' | 'permission_denied'>;
  loadPointWallet: () => Promise<void>;
  setUnauthenticated: () => void;
  loadQRCode: () => Promise<void>;
  scanQRCode: (scannedUserId: string) => Promise<number>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  pointWallet: null,
  authLoading: false,
  isAuthenticated: false,
  qrCodeUrl: null,
  qrLoading: false,

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
    } catch (error) {
      console.error('Auto-login failed:', error);
      clearTokens();
      set({ authLoading: false, isAuthenticated: false, user: null, pointWallet: null });
    }
  },

  loginWithZalo: async () => {
    set({ authLoading: true });
    try {
      let zaloAccessToken: string | null = null;
      let locationToken: string | undefined;
      try {
        await getUserInfo({ autoRequestPermission: true });
        zaloAccessToken = await getZaloAccessToken();
        locationToken = await getZaloLocationToken().catch(() => undefined);
      } catch (permissionError) {
        console.warn('Zalo permission denied:', permissionError);
        set({ authLoading: false });
        return 'permission_denied';
      }

      if (!zaloAccessToken) {
        set({ authLoading: false });
        return 'permission_denied';
      }

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

  loadQRCode: async () => {
    const { user } = get();
    if (!user?.id) return;

    set({ qrLoading: true });
    try {
      const { data } = await axiosClient.get(`/users/${user.id}/qr-code`);
      set({ qrCodeUrl: data.qrCodeUrl, qrLoading: false });
    } catch (error) {
      console.error('Failed to load QR code:', error);
      set({ qrLoading: false });
      throw error;
    }
  },

  scanQRCode: async (scannedUserId: string) => {
    try {
      const { data } = await axiosClient.post('/qr-code/scan', { scannedUserId });
      if (data.totalPoints !== undefined) {
        set((state) => ({
          pointWallet: state.pointWallet
            ? { ...state.pointWallet, currentBalance: data.totalPoints }
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
