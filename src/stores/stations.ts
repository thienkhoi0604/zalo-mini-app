import { create } from 'zustand';
import { Station } from '@/types/station';
import { getStations } from '@/apis/stations';

const PAGE_SIZE = 5;

interface StationsState {
  stations: Station[];
  page: number;
  hasMore: boolean;
  loading: boolean;

  /** Load page 1, reset list */
  loadStations: () => Promise<void>;
  /** Append next page */
  loadMore: () => Promise<void>;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  stations: [],
  page: 0,
  hasMore: true,
  loading: false,

  loadStations: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await getStations({ pageNumber: 1, pageSize: PAGE_SIZE });
      set({
        stations: res.data.items ?? [],
        page: 1,
        hasMore: res.data.hasNext ?? false,
      });
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async () => {
    const { loading, hasMore, page } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const nextPage = page + 1;
      const res = await getStations({ pageNumber: nextPage, pageSize: PAGE_SIZE });
      set((state) => ({
        stations: [...state.stations, ...(res.data.items ?? [])],
        page: nextPage,
        hasMore: res.data.hasNext ?? false,
      }));
    } finally {
      set({ loading: false });
    }
  },
}));
