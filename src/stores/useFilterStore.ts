import { create } from 'zustand';
import { FilterState } from '../types';

interface FilterStoreState {
  appliedFilters: FilterState;
  draftFilters: FilterState;
  isFilterSheetOpen: boolean;

  // Actions
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
  toggleDraftCategory: (categoryId: string) => void;
  toggleDraftBrand: (brandName: string) => void;
  toggleDraftPriceRange: (rangeKey: string) => void;
  toggleDraftDietary: (item: string) => void;
  setDraftMinRating: (rating: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceRanges: [],
  dietary: [],
  minRating: 0,
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  appliedFilters: DEFAULT_FILTERS,
  draftFilters: DEFAULT_FILTERS,
  isFilterSheetOpen: false,

  openFilterSheet: () =>
    set((state) => ({
      isFilterSheetOpen: true,
      draftFilters: { ...state.appliedFilters },
    })),

  closeFilterSheet: () => set({ isFilterSheetOpen: false }),

  toggleDraftCategory: (categoryId) =>
    set((state) => {
      const exists = state.draftFilters.categories.includes(categoryId);
      const newCats = exists
        ? state.draftFilters.categories.filter((c) => c !== categoryId)
        : [...state.draftFilters.categories, categoryId];
      return { draftFilters: { ...state.draftFilters, categories: newCats } };
    }),

  toggleDraftBrand: (brandName) =>
    set((state) => {
      const exists = state.draftFilters.brands.includes(brandName);
      const newBrands = exists
        ? state.draftFilters.brands.filter((b) => b !== brandName)
        : [...state.draftFilters.brands, brandName];
      return { draftFilters: { ...state.draftFilters, brands: newBrands } };
    }),

  toggleDraftPriceRange: (rangeKey) =>
    set((state) => {
      const exists = state.draftFilters.priceRanges.includes(rangeKey);
      const newRanges = exists
        ? state.draftFilters.priceRanges.filter((r) => r !== rangeKey)
        : [...state.draftFilters.priceRanges, rangeKey];
      return { draftFilters: { ...state.draftFilters, priceRanges: newRanges } };
    }),

  toggleDraftDietary: (item) =>
    set((state) => {
      const exists = state.draftFilters.dietary.includes(item);
      const newDietary = exists
        ? state.draftFilters.dietary.filter((d) => d !== item)
        : [...state.draftFilters.dietary, item];
      return { draftFilters: { ...state.draftFilters, dietary: newDietary } };
    }),

  setDraftMinRating: (rating) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        minRating: state.draftFilters.minRating === rating ? 0 : rating,
      },
    })),

  applyFilters: () =>
    set((state) => ({
      appliedFilters: { ...state.draftFilters },
      isFilterSheetOpen: false,
    })),

  resetFilters: () =>
    set({
      appliedFilters: DEFAULT_FILTERS,
      draftFilters: DEFAULT_FILTERS,
      isFilterSheetOpen: false,
    }),
}));
