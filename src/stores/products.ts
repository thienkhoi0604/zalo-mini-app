import { create } from "zustand";
import { Category } from "@/types/category";
import { Product, Variant } from "@/types/product";
import { wait } from "@/utils/async";
import categoriesJson from "../../mock/categories.json";

type ProductsStore = {
  categories: Category[];
  products: Product[];
  loading: boolean;
  selectedCategoryId: string;
  keyword: string;
  loadProducts: () => Promise<void>;
  setSelectedCategoryId: (id: string) => void;
  setKeyword: (keyword: string) => void;
  recommendProducts: () => Product[];
  productsByCategory: (categoryId: string) => Product[];
  searchResult: () => Product[];
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  categories: categoriesJson as Category[],
  products: [],
  loading: false,
  selectedCategoryId: "coffee",
  keyword: "",
  loadProducts: async () => {
    if (get().products.length) return;
    set({ loading: true });
    await wait(2000);
    const products = (await import("../../mock/products.json")).default as Product[];
    const variants = (await import("../../mock/variants.json"))
      .default as Variant[];
    const withVariants = products.map(
      (product) =>
        ({
          ...product,
          variants: variants.filter((variant) =>
            product.variantId.includes(variant.id)
          ),
        } as Product)
    );
    set({ products: withVariants, loading: false });
  },
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setKeyword: (keyword) => set({ keyword }),
  recommendProducts: () => {
    return get().products.filter((p) => p.sale);
  },
  productsByCategory: (categoryId) => {
    return get().products.filter((product) =>
      product.categoryId.includes(categoryId)
    );
  },
  searchResult: () => {
    const keyword = get().keyword;
    if (!keyword.trim()) return [];
    return get().products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
}));

