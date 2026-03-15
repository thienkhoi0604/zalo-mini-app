import { create } from "zustand";
import { getUserInfo } from "zmp-sdk";
import type { BackendUser } from "apis/authorization";

type UserStore = {
  zaloUser: any | null;
  backendUser: BackendUser | null;
  loadingZalo: boolean;
  loadZaloUser: () => Promise<void>;
  setBackendUser: (user: BackendUser | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  zaloUser: null,
  backendUser: null,
  loadingZalo: false,
  loadZaloUser: async () => {
    set({ loadingZalo: true });
    const { userInfo } = await getUserInfo({ autoRequestPermission: true });
    set({ zaloUser: userInfo, loadingZalo: false });
  },
  setBackendUser: (user) => set({ backendUser: user }),
}));

