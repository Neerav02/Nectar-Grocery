import React, { useState } from 'react';
import { Plus, Heart, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { clsx } from 'clsx';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isFav = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFav = useFavoritesStore((state) => state.toggleFavorite);

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav(product.id);
  };

  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="group relative bg-white border border-[#E2E2E2] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#53B175]/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#53B175] outline-none select-none h-full"
    >
      {/* Heart Favorite Toggle Button */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors z-10 focus-visible:ring-2 focus-visible:ring-[#53B175]"
      >
        <Heart
          className={clsx('w-5 h-5 transition-transform group-hover:scale-110', isFav && 'fill-red-500 text-red-500')}
        />
      </button>

      {/* Product Image Stage */}
      <div className="w-full h-32 flex items-center justify-center p-2 mb-3 bg-[#F8F9FA]/50 rounded-xl overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#181725] text-base leading-tight line-clamp-2 mb-1 group-hover:text-[#53B175] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#7C7C7C] font-medium mb-3">{product.unit}</p>
        </div>

        {/* Price & Add to Cart Button Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F2F3F2]">
          <div className="flex flex-col">
            <span className="font-bold text-[#181725] text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#7C7C7C] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={clsx(
              'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#53B175] outline-none active:scale-90 shadow-xs',
              isAdded
                ? 'bg-emerald-700 text-white scale-105'
                : 'bg-[#53B175] text-white hover:bg-[#439B63]'
            )}
          >
            {isAdded ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
