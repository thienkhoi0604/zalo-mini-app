import { create } from "zustand";
import { getUserInfo, closeApp } from "zmp-sdk";
import { getAccessToken as getAccessTokenZalo } from "zmp-sdk/apis";

import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  refreshTokens,
  fetchUserInfo,
} from "apis/authorization";
import { User } from "@/types/user";

type UserStore = {
  zaloUser: any | null;
  zaloAccessToken: string | null;
  user: User | null;
  loadingZalo: boolean;
  authLoading: boolean;
  isAuthenticated: boolean;
  qrCodeUrl: string | null;
  qrLoading: boolean;

  loadZaloUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  loginWithZalo: (accessToken: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  loadQRCode: () => Promise<void>;
  scanQRCode: (scannedUserId: string) => Promise<number>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  zaloUser: null,
  zaloAccessToken: null,
  user: null,
  loadingZalo: false,
  authLoading: false,
  isAuthenticated: false,
  qrCodeUrl: null,
  qrLoading: false,

  loadZaloUser: async () => {
    set({ loadingZalo: true });
    try {
      const response = await getUserInfo({ autoRequestPermission: true });

      const { userInfo } = response;
      const accessToken = await getAccessTokenZalo();
      console.log("Zalo user info:", userInfo);
      console.log("Zalo access token:", accessToken);

      const tokenFromResponse = (response as any)?.accessToken || (userInfo as any)?.accessToken;
      const finalToken = accessToken || tokenFromResponse;


      set({
        zaloUser: userInfo,
        zaloAccessToken: finalToken || null,
        loadingZalo: false
      });
    } catch (error) {
      console.error("Permission denied:", error);
      set({ loadingZalo: false });

      closeApp();
    }
  },

  setAuthLoading: (loading) => set({ authLoading: loading }),

  initializeAuth: async () => {
    set({ authLoading: true });

    try {
      const token = getAccessToken();
      if (!token) {
        set({ authLoading: false, isAuthenticated: false, user: null });
        return;
      }

      try {
        const user = await fetchUserInfo();
        set({
          user: user,
          isAuthenticated: true,
          authLoading: false,
        });
        console.log("Auto-login successful:", user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        set({
          authLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        authLoading: false,
        isAuthenticated: false,
        user: null,
      });
    }
  },

  loginWithZalo: async (accessToken: string) => {
    set({ authLoading: true });
    try {
      const user = await loginWithZaloUser(accessToken);
      set({
        user: user,
        isAuthenticated: true,
        authLoading: false,
      });
    } catch (error) {
      console.error("Login failed:", error);
      set({ authLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      zaloUser: null,
      zaloAccessToken: null,
    });
  },

  refreshAuthToken: async () => {
    try {
      await refreshTokens();
      const state = get();
      if (state.isAuthenticated) {
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      get().logout();
      throw error;
    }
  },

  loadQRCode: async () => {
    const state = get();
    if (!state.user?.id) return;

    set({ qrLoading: true });
    try {
      const { data } = await (await import("apis/client")).default.get(
        `/users/${state.user.id}/qr-code`
      );
      set({ qrCodeUrl: data.qrCodeUrl, qrLoading: false });
    } catch (error) {
      console.error("Failed to load QR code:", error);
      set({ qrLoading: false });
      throw error;
    }
  },

  scanQRCode: async (scannedUserId: string) => {
    try {
      const { data } = await (await import("apis/client")).default.post(
        "/qr-code/scan",
        { scannedUserId }
      );

      if (data.totalPoints !== undefined) {
        const state = get();
        if (state.user) {
          set({
            user: {
              ...state.user,
              points: data.totalPoints,
            },
          });
        }
      }

      return data.points || 0;
    } catch (error) {
      console.error("Failed to scan QR code:", error);
      throw error;
    }
  },
}));

