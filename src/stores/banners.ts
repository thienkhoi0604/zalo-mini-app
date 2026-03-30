import { create } from 'zustand';
import { Banner } from '@/types/banner';
import { getBanners } from '@/apis/banners';

interface BannersState {
  banners: Banner[];
  loading: boolean;
  loadBanners: () => Promise<void>;
}

export const useBannersStore = create<BannersState>((set, get) => ({
  banners: [],
  loading: false,

  loadBanners: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const banners = await getBanners();
      set({ banners: banners.filter((b) => b.isActive).sort((a, b) => a.displayOrder - b.displayOrder) });
    } finally {
      set({ loading: false });
    }
  },
}));
