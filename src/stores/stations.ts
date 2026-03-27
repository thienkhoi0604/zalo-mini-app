import { create } from 'zustand';
import { Station } from '@/types/station';
import { getStations, MOCK_STATIONS } from '@/apis/stations';

const PAGE_SIZE = 10;

export interface StationFilters {
  search: string;
  provinceCode: string;
  wardCode: string;
}

interface StationsState extends StationFilters {
  stations: Station[];
  allForFilter: Station[];   // full unfiltered list for province/ward options
  page: number;
  hasMore: boolean;
  loading: boolean;

  loadStations: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: Partial<StationFilters>) => void;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  stations: [],
  allForFilter: [],
  page: 0,
  hasMore: true,
  loading: false,
  search: '',
  provinceCode: '',
  wardCode: '',

  loadStations: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { search, provinceCode, wardCode } = get();

      // Load unfiltered list once for dropdown options
      if (get().allForFilter.length === 0) {
        set({ allForFilter: MOCK_STATIONS });
      }

      const res = await getStations({
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        provinceCode: provinceCode || undefined,
        wardCode: wardCode || undefined,
      });
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
    const { loading, hasMore, page, search, provinceCode, wardCode } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const nextPage = page + 1;
      const res = await getStations({
        pageNumber: nextPage,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        provinceCode: provinceCode || undefined,
        wardCode: wardCode || undefined,
      });
      set((state) => ({
        stations: [...state.stations, ...(res.data.items ?? [])],
        page: nextPage,
        hasMore: res.data.hasNext ?? false,
      }));
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (filters) => {
    const current = get();
    // Reset ward when province changes
    const nextProvince = filters.provinceCode !== undefined ? filters.provinceCode : current.provinceCode;
    const nextWard = filters.provinceCode !== undefined && filters.provinceCode !== current.provinceCode
      ? ''
      : (filters.wardCode !== undefined ? filters.wardCode : current.wardCode);

    set({ ...filters, provinceCode: nextProvince, wardCode: nextWard });
    get().loadStations();
  },
}));
