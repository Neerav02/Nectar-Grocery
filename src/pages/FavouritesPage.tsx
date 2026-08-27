import React from 'react';
import { ChevronRight, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { PillButton } from '../components/common/PillButton';
import { INITIAL_PRODUCTS } from '../api/productsData';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useCartStore } from '../stores/useCartStore';

interface FavouritesPageProps {
  onSelectProduct: (product: Product) => void;
  onExplore: () => void;
}

export const FavouritesPage: React.FC<FavouritesPageProps> = ({ onSelectProduct, onExplore }) => {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);

  const favoriteProducts = INITIAL_PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((p) => addItem(p, 1));
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-[#181725] text-center tracking-tight pb-2 border-b border-[#F2F3F2]">
        Favourite
      </h1>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          title="No Favorite Items"
          description="Save your favorite fruits, beverages, and groceries here for quick reordering."
          actionText="Discover Products"
          onAction={onExplore}
        />
      ) : (
        <div className="space-y-1">
          <div className="divide-y divide-[#F2F3F2]">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-xl flex items-center justify-center p-2 border border-[#E2E2E2] shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#181725] text-base truncate group-hover:text-[#53B175] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#7C7C7C] font-medium">{product.unit}</p>
                </div>

                {/* Price & Chevron */}
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-[#181725] text-base">${product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="p-1 text-gray-300 hover:text-red-500 rounded-full"
                    aria-label="Remove favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Bottom CTA */}
          <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] z-30 max-w-md mx-auto sm:max-w-none">
            <PillButton onClick={handleAddAllToCart} size="lg" icon={<ShoppingBag className="w-5 h-5" />}>
              Add All To Cart
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
};
