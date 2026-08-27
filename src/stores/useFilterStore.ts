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
  applyFilters: () => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
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
