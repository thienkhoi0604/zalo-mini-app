import { create } from 'zustand';
import { Voucher, UserVoucher, StoreGroup, GroupedFeedResult, AppCategory } from '@/types/voucher';
import { getFeedItems, getFeedGrouped } from '@/api/feed';
import { getCategories } from '@/api/categories';
import { getVoucherById, getStoreItemById, getUserVouchers, getUserVouchersCount, redeemVoucher } from '@/api/vouchers';
import { useUserStore } from '@/store/user';

const USER_VOUCHERS_PAGE_SIZE = 5;

export const OTHER_CATEGORY_ID = '__other__';

type VouchersStore = {
  allVouchers: Voucher[];
  userVouchers: UserVoucher[];
  userVouchersPage: number;
  userVouchersHasMore: boolean;
  userVouchersUnusedCount: number;
  /** Loading flag for allVouchers / voucher detail / storeGroups */
  loading: boolean;
  /** Loading flag exclusively for userVouchers (my-vouchers) */
  userVouchersLoading: boolean;
  redeeming: boolean;

  // Grouped (by-store) feed
  globalVouchers: Voucher[];
  storeGroups: StoreGroup[];
  storeGroupsLoading: boolean;

  // Categories from /app/categories
  categories: AppCategory[];
  categoriesLoading: boolean;

  loadAllVouchers: () => Promise<void>;
  loadVoucherById: (id: string) => Promise<void>;
  loadUserVouchers: () => Promise<void>;
  loadMoreUserVouchers: () => Promise<void>;
  loadUserVouchersCount: () => Promise<void>;
  loadStoreGroups: () => Promise<void>;
  loadCategories: () => Promise<void>;
  redeemVoucher: (voucherId: string) => Promise<void>;
  getGroupedByCategory: () => Record<string, Voucher[]>;
};

export const useVouchersStore = create<VouchersStore>((set, get) => ({
  allVouchers: [],
  userVouchers: [],
  userVouchersPage: 0,
  userVouchersHasMore: true,
  userVouchersUnusedCount: 0,
  loading: false,
  userVouchersLoading: false,
  redeeming: false,
  globalVouchers: [],
  storeGroups: [],
  storeGroupsLoading: false,
  categories: [],
  categoriesLoading: false,

  loadAllVouchers: async () => {
    set({ loading: true });
    try {
      const items = await getFeedItems({ pageNumber: 1, pageSize: 200 });
      set({ allVouchers: items, loading: false });
    } catch (error) {
      console.error('Failed to load vouchers:', error);
      set({ loading: false });
      throw error;
    }
  },

  loadVoucherById: async (id: string) => {
    set({ loading: true });
    try {
      const existing = get().allVouchers.find((r) => r.id === id);
      const source = existing?.source ?? 'Reward';
      const voucher = source === 'StoreItem'
        ? await getStoreItemById(id)
        : await getVoucherById(id);
      if (!voucher) {
        set({ loading: false });
        return;
      }
      set((state) => ({
        allVouchers: state.allVouchers.some((r) => r.id === id)
          ? state.allVouchers.map((r) => (r.id === id ? voucher : r))
          : [...state.allVouchers, voucher],
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load voucher detail:', error);
      set({ loading: false });
      throw error;
    }
  },

  loadUserVouchers: async () => {
    if (get().userVouchersLoading) return;
    set({ userVouchersLoading: true });
    try {
      const res = await getUserVouchers({ pageNumber: 1, pageSize: USER_VOUCHERS_PAGE_SIZE });
      set({
        userVouchers: res.data.items ?? [],
        userVouchersPage: 1,
        userVouchersHasMore: res.data.hasNext ?? false,
      });
    } catch (error) {
      console.error('Failed to load user vouchers:', error);
    } finally {
      set({ userVouchersLoading: false });
    }
  },

  loadMoreUserVouchers: async () => {
    const { userVouchersLoading, userVouchersHasMore, userVouchersPage } = get();
    if (userVouchersLoading || !userVouchersHasMore) return;
    set({ userVouchersLoading: true });
    try {
      const nextPage = userVouchersPage + 1;
      const res = await getUserVouchers({ pageNumber: nextPage, pageSize: USER_VOUCHERS_PAGE_SIZE });
      set((state) => ({
        userVouchers: [...state.userVouchers, ...(res.data.items ?? [])],
        userVouchersPage: nextPage,
        userVouchersHasMore: res.data.hasNext ?? false,
      }));
    } catch (error) {
      console.error('Failed to load more user vouchers:', error);
    } finally {
      set({ userVouchersLoading: false });
    }
  },

  loadUserVouchersCount: async () => {
    try {
      const count = await getUserVouchersCount();
      set({ userVouchersUnusedCount: count });
    } catch {
      // silently ignore
    }
  },

  loadStoreGroups: async () => {
    if (get().storeGroupsLoading) return;
    set({ storeGroupsLoading: true });
    try {
      const result: GroupedFeedResult = await getFeedGrouped();
      set({ globalVouchers: result.globalVouchers, storeGroups: result.stores });
    } catch (error) {
      console.error('Failed to load store groups:', error);
    } finally {
      set({ storeGroupsLoading: false });
    }
  },

  loadCategories: async () => {
    if (get().categoriesLoading) return;
    set({ categoriesLoading: true });
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      set({ categoriesLoading: false });
    }
  },

  redeemVoucher: async (voucherId: string) => {
    set({ redeeming: true });
    try {
      const voucher = get().allVouchers.find((r) => r.id === voucherId);
      await redeemVoucher(voucherId, voucher?.source === 'StoreItem' ? 'Product' : 'Reward');
      await Promise.all([
        get().loadUserVouchers(),
        get().loadUserVouchersCount(),
        useUserStore.getState().loadPointWallet(),
      ]);
      set({ redeeming: false });
    } catch (error) {
      console.error('Failed to redeem voucher:', error);
      set({ redeeming: false });
      throw error;
    }
  },

  getGroupedByCategory: () => {
    const { allVouchers, categories } = get();
    const knownCategoryIds = new Set(categories.map((c) => c.id));

    // Build a map of categoryId → items from allVouchers that have a known categoryId
    const grouped: Record<string, Voucher[]> = {};
    const uncategorized: Voucher[] = [];

    allVouchers.forEach((voucher) => {
      if (voucher.categoryId && knownCategoryIds.has(voucher.categoryId)) {
        if (!grouped[voucher.categoryId]) grouped[voucher.categoryId] = [];
        grouped[voucher.categoryId].push(voucher);
      } else if (voucher.source !== 'StoreItem') {
        uncategorized.push(voucher);
      }
    });

    // Return ordered by the categories list from /app/categories
    const ordered: Record<string, Voucher[]> = {};
    categories.forEach((cat) => {
      if (grouped[cat.id]) ordered[cat.id] = grouped[cat.id];
    });

    // Append uncategorized items under a special key
    if (uncategorized.length > 0) {
      ordered[OTHER_CATEGORY_ID] = uncategorized;
    }

    return ordered;
  },
}));
