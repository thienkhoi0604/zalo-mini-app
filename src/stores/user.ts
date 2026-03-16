import { create } from "zustand";
import { getUserInfo } from "zmp-sdk";
import { getAccessToken as getAccessTokenZalo } from "zmp-sdk/apis";

import {
  loginWithZaloUser,
  clearTokens,
  getAccessToken,
  isTokenExpired,
  shouldRefreshToken,
  refreshTokens,
  fetchUserInfo,
} from "apis/authorization";
import { User } from "@/types/user";

type UserStore = {
  // State
  zaloUser: any | null;
  zaloAccessToken: string | null;
  user: User | null;
  loadingZalo: boolean;
  authLoading: boolean;
  isAuthenticated: boolean;
  tokenExpiryTime: number | null;
  qrCodeUrl: string | null;
  qrLoading: boolean;

  // Actions
  loadZaloUser: () => Promise<void>;
  setBackendUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
  loginWithZalo: (userInfo: any, accessToken: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  setTokenExpiryTime: (time: number | null) => void;
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
  tokenExpiryTime: null,
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
      set({ loadingZalo: false });
    }
  },

  setBackendUser: (user) => {
    set({
      user: user,
      isAuthenticated: !!user,
    });
  },

  setTokenExpiryTime: (time) => set({ tokenExpiryTime: time }),

  setAuthLoading: (loading) => set({ authLoading: loading }),

  initializeAuth: async () => {
    set({ authLoading: true });

    try {
      // Check if we have a valid access token
      const token = getAccessToken();
      if (!token) {
        // No token, clear auth state
        set({ authLoading: false, isAuthenticated: false, user: null });
        return;
      }

      // Check if token is expired
      if (isTokenExpired()) {
        try {
          // Try to refresh token
          console.log("Token expired, attempting refresh...");
          await refreshTokens();
        } catch (error) {
          console.error("Token refresh failed:", error);
          set({
            authLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return;
        }
      }

      // At this point we have a valid token
      // Try to fetch user info from backend
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

  loginWithZalo: async (userInfo: any, accessToken: string) => {
    set({ authLoading: true });
    try {
      const user = await loginWithZaloUser(userInfo, accessToken);
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
      tokenExpiryTime: null,
    });
  },

  refreshAuthToken: async () => {
    try {
      await refreshTokens();
      // Token refresh successful, update state if needed
      const state = get();
      if (state.isAuthenticated) {
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, clear auth
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

      // Update user points if present in response
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

// Setup periodic token refresh
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startTokenRefreshInterval() {
  if (refreshInterval) return;

  refreshInterval = setInterval(async () => {
    const state = useUserStore.getState();
    // Only refresh if authenticated
    if (state.isAuthenticated && shouldRefreshToken()) {
      try {
        await state.refreshAuthToken();
      } catch (error) {
        console.error("Periodic token refresh failed:", error);
      }
    }
  }, 30000); // Check every 30 seconds
}

export function stopTokenRefreshInterval() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

