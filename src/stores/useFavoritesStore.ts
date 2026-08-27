import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: ['p-1', 'p-2', 'p-10'], // default favorites matching Figma demo
      toggleFavorite: (productId) => {
        set((state) => {
          const exists = state.favoriteIds.includes(productId);
          if (exists) {
            return { favoriteIds: state.favoriteIds.filter((id) => id !== productId) };
          }
          return { favoriteIds: [...state.favoriteIds, productId] };
        });
      },
      isFavorite: (productId) => get().favoriteIds.includes(productId),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'nectar_favorites_storage',
    }
  )
);
