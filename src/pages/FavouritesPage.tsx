import React from 'react';
import { ChevronRight, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { PillButton } from '../components/common/PillButton';
import { INITIAL_PRODUCTS } from '../api/productsData';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useCartStore } from '../stores/useCartStore';
import { useToastStore } from '../stores/useToastStore';

interface FavouritesPageProps {
  onSelectProduct: (product: Product) => void;
  onExplore: () => void;
}

export const FavouritesPage: React.FC<FavouritesPageProps> = ({ onSelectProduct, onExplore }) => {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const favoriteProducts = INITIAL_PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((p) => addItem(p, 1));
    addToast('Added to the basket', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 md:pb-12 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-[#181725] text-center tracking-tight pb-3 border-b border-[#F2F3F2]">
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
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-2xs border border-[#F2F3F2] divide-y divide-[#F2F3F2]">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 px-3 rounded-2xl transition-colors group"
              >
                {/* Full-bleed cover thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F4F5F4] rounded-xl overflow-hidden border border-[#E2E2E2] shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#181725] text-base truncate group-hover:text-[#53B175] transition-colors leading-tight">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#7C7C7C] font-semibold mt-1">{product.unit}</p>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-extrabold text-[#181725] text-base sm:text-lg">${product.price.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                      addToast('Removed from wishlist', 'info');
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop inline CTA (Never overlaps content!) */}
          <div className="hidden md:block">
            <PillButton onClick={handleAddAllToCart} size="lg" icon={<ShoppingBag className="w-5 h-5" />}>
              Add All To Cart
            </PillButton>
          </div>

          {/* Mobile Docked Bottom CTA */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] z-30 max-w-md mx-auto">
            <PillButton onClick={handleAddAllToCart} size="lg" icon={<ShoppingBag className="w-5 h-5" />}>
              Add All To Cart
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
};
