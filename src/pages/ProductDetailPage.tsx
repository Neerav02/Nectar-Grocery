import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, ChevronDown, ChevronUp, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { PillButton } from '../components/common/PillButton';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { clsx } from 'clsx';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isFav = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFav = useFavoritesStore((state) => state.toggleFavorite);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Accordion state
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12 animate-fade-in">
      {/* Top Bar over image stage */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          aria-label="Share product"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Large Product Image Carousel Stage */}
      <div className="bg-[#F2F3F2] rounded-3xl p-8 flex flex-col items-center justify-center relative min-h-[260px] border border-[#E2E2E2]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-56 max-w-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
        />

        {/* Carousel Dots */}
        <div className="flex items-center space-x-2 mt-6">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                activeImageIndex === idx ? 'w-6 bg-[#53B175]' : 'w-2 bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>

      {/* Title & Favorite Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#181725] mb-1">{product.name}</h1>
          <p className="text-sm font-semibold text-[#7C7C7C]">{product.unit}</p>
        </div>

        <button
          type="button"
          onClick={() => toggleFav(product.id)}
          aria-label="Toggle favorite"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <Heart
            className={clsx('w-6 h-6', isFav ? 'fill-red-500 text-red-500' : 'text-gray-400')}
          />
        </button>
      </div>

      {/* Stepper & Price Row */}
      <div className="flex items-center justify-between py-2 border-y border-[#F2F3F2]">
        <QuantityStepper
          quantity={quantity}
          onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stockQuantity))}
          onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
          max={product.stockQuantity}
        />

        <span className="text-2xl font-extrabold text-[#181725]">
          ${(product.price * quantity).toFixed(2)}
        </span>
      </div>

      {/* Accordion Rows */}
      <div className="divide-y divide-[#F2F3F2]">
        {/* Accordion 1: Product Detail */}
        <div className="py-4">
          <button
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className="w-full flex items-center justify-between font-bold text-base text-[#181725] text-left"
          >
            <span>Product Detail</span>
            {isDetailOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {isDetailOpen && (
            <p className="text-xs text-[#7C7C7C] leading-relaxed mt-3 animate-fade-in">
              {product.description}
            </p>
          )}
        </div>

        {/* Accordion 2: Nutritions */}
        <div className="py-4">
          <button
            onClick={() => setIsNutritionOpen(!isNutritionOpen)}
            className="w-full flex items-center justify-between font-bold text-base text-[#181725] text-left"
          >
            <span>Nutritions</span>
            <div className="flex items-center space-x-2">
              <span className="bg-[#F2F3F2] text-[#7C7C7C] text-xs px-2 py-0.5 rounded font-bold">
                {product.nutritionInfo.weight}
              </span>
              {isNutritionOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </div>
          </button>
          {isNutritionOpen && (
            <div className="mt-3 text-xs text-[#7C7C7C] space-y-1.5 animate-fade-in">
              <p>Calories: {product.nutritionInfo.calories || 'N/A'}</p>
              <p>Organic Certified: {product.nutritionInfo.organic ? 'Yes' : 'No'}</p>
              <p>Brand: {product.brand}</p>
            </div>
          )}
        </div>

        {/* Accordion 3: Review */}
        <div className="py-4">
          <button
            onClick={() => setIsReviewOpen(!isReviewOpen)}
            className="w-full flex items-center justify-between font-bold text-base text-[#181725] text-left"
          >
            <span>Review</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-500 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                ))}
              </div>
              {isReviewOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </div>
          </button>
          {isReviewOpen && (
            <div className="mt-3 text-xs text-[#7C7C7C] space-y-2 animate-fade-in">
              <p className="font-semibold text-[#181725]">
                Rating: {product.rating} / 5.0 ({product.reviewsCount} customer reviews)
              </p>
              <p>&quot;Extremely fresh product! Delivered super fast in great condition.&quot; - Sarah M.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] z-30 max-w-md mx-auto sm:max-w-none">
        <PillButton onClick={handleAddToCart} size="lg">
          {isAdded ? (
            <span className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Added to Basket!</span>
            </span>
          ) : (
            'Add To Basket'
          )}
        </PillButton>
      </div>
    </div>
  );
};
