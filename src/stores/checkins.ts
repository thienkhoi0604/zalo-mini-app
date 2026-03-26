import { create } from 'zustand';
import { CheckinHistoryItem } from '@/types/checkin';
import { getCheckinHistory } from '@/apis/checkins';

const PAGE_SIZE = 5;

interface CheckinsState {
  history: CheckinHistoryItem[];
  page: number;
  hasMore: boolean;
  historyLoading: boolean;

  /** Load page 1, reset list */
  loadHistory: () => Promise<void>;
  /** Append next page */
  loadMoreHistory: () => Promise<void>;
}

export const useCheckinsStore = create<CheckinsState>((set, get) => ({
  history: [],
  page: 0,
  hasMore: true,
  historyLoading: false,

  loadHistory: async () => {
    if (get().historyLoading) return;
    set({ historyLoading: true });
    try {
      const res = await getCheckinHistory({ pageNumber: 1, pageSize: PAGE_SIZE });
      set({
        history: res.data.items ?? [],
        page: 1,
        hasMore: res.data.hasNext ?? false,
      });
    } finally {
      set({ historyLoading: false });
    }
  },

  loadMoreHistory: async () => {
    const { historyLoading, hasMore, page } = get();
    if (historyLoading || !hasMore) return;
    set({ historyLoading: true });
    try {
      const nextPage = page + 1;
      const res = await getCheckinHistory({ pageNumber: nextPage, pageSize: PAGE_SIZE });
      set((state) => ({
        history: [...state.history, ...(res.data.items ?? [])],
        page: nextPage,
        hasMore: res.data.hasNext ?? false,
      }));
    } finally {
      set({ historyLoading: false });
    }
  },
}));
