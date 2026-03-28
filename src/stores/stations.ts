import { create } from 'zustand';
import { Station, Province, Ward } from '@/types/station';
import { getStations } from '@/apis/stations';
import { fetchProvinces } from '@/apis/provinces';
import { fetchWards } from '@/apis/wards';

const PAGE_SIZE = 10;

export interface StationFilters {
  search: string;
  provinceCode: string;
  wardCode: string;
}

interface StationsState extends StationFilters {
  stations: Station[];
  provinces: Province[];
  wards: Ward[];
  wardsLoading: boolean;
  page: number;
  hasMore: boolean;
  loading: boolean;

  loadStations: () => Promise<void>;
  loadMore: () => Promise<void>;
  loadProvinces: () => Promise<void>;
  loadWards: (provinceCode: string) => Promise<void>;
  setFilters: (filters: Partial<StationFilters>) => void;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  stations: [],
  provinces: [],
  wards: [],
  wardsLoading: false,
  page: 0,
  hasMore: true,
  loading: false,
  search: '',
  provinceCode: '',
  wardCode: '',

  loadProvinces: async () => {
    if (get().provinces.length > 0) return;
    const provinces = await fetchProvinces();
    set({ provinces });
  },

  loadWards: async (provinceCode) => {
    if (!provinceCode) {
      set({ wards: [] });
      return;
    }
    set({ wardsLoading: true });
    try {
      const wards = await fetchWards(provinceCode);
      set({ wards });
    } finally {
      set({ wardsLoading: false });
    }
  },

  loadStations: async () => {
    set({ loading: true });
    try {
      const { search, provinceCode, wardCode } = get();
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
    const provinceChanged =
      filters.provinceCode !== undefined && filters.provinceCode !== current.provinceCode;

    const nextProvince =
      filters.provinceCode !== undefined ? filters.provinceCode : current.provinceCode;
    const nextWard = provinceChanged
      ? ''
      : filters.wardCode !== undefined
      ? filters.wardCode
      : current.wardCode;

    set({ ...filters, provinceCode: nextProvince, wardCode: nextWard });

    if (provinceChanged) {
      get().loadWards(nextProvince);
    }

    get().loadStations();
  },
}));
