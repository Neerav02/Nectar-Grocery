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
    /* Extra bottom padding so sticky button never obscures content */
    <div className="max-w-2xl mx-auto animate-fade-in pb-32 md:pb-8">

      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center justify-between py-2 mb-4">
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

      {/* ── Product Image Card (Full Cover Display Stage) ── */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-3xl overflow-hidden border border-[#E9EAEC] mb-6 shadow-sm bg-[#F4F5F4]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Carousel Dots Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-2 z-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              aria-label={`Image ${idx + 1}`}
              className={clsx(
                'h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#53B175]',
                activeImageIndex === idx ? 'w-6 bg-[#53B175]' : 'w-2 bg-white/70 hover:bg-white'
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Name + Favorite ── */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#181725] leading-tight">{product.name}</h1>
          <p className="text-sm font-semibold text-[#7C7C7C] mt-0.5">{product.unit}</p>
        </div>

        <button
          type="button"
          onClick={() => toggleFav(product.id)}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] shrink-0"
        >
          <Heart className={clsx('w-6 h-6', isFav ? 'fill-red-500 text-red-500' : 'text-gray-300')} />
        </button>
      </div>

      {/* ── Quantity Stepper + Price ── */}
      <div className="flex items-center justify-between py-4 border-y border-[#F2F3F2] mb-2">
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

      {/* ── Accordion Sections ── */}
      <div className="divide-y divide-[#F2F3F2]">

        {/* Accordion 1: Product Detail */}
        <div>
          <button
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className="w-full flex items-center justify-between py-4 font-bold text-base text-[#181725] text-left hover:text-[#53B175] transition-colors"
          >
            <span>Product Detail</span>
            {isDetailOpen
              ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
              : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
          </button>
          {isDetailOpen && (
            <p className="text-sm text-[#7C7C7C] leading-relaxed pb-4 animate-fade-in">
              {product.description}
            </p>
          )}
        </div>

        {/* Accordion 2: Nutritions */}
        <div>
          <button
            onClick={() => setIsNutritionOpen(!isNutritionOpen)}
            className="w-full flex items-center justify-between py-4 font-bold text-base text-[#181725] text-left hover:text-[#53B175] transition-colors"
          >
            <span>Nutritions</span>
            <div className="flex items-center space-x-2">
              <span className="bg-[#F2F3F2] text-[#7C7C7C] text-xs px-2 py-0.5 rounded font-bold">
                {product.nutritionInfo.weight}
              </span>
              {isNutritionOpen
                ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </div>
          </button>
          {isNutritionOpen && (
            <div className="pb-4 animate-fade-in space-y-2">
              <div className="flex justify-between text-sm border-b border-[#F2F3F2] py-2">
                <span className="text-[#7C7C7C]">Calories</span>
                <span className="font-semibold text-[#181725]">{product.nutritionInfo.calories || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-[#F2F3F2] py-2">
                <span className="text-[#7C7C7C]">Organic Certified</span>
                <span className="font-semibold text-[#53B175]">{product.nutritionInfo.organic ? 'Yes ✓' : 'No'}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-[#7C7C7C]">Brand</span>
                <span className="font-semibold text-[#181725]">{product.brand}</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Review */}
        <div>
          <button
            onClick={() => setIsReviewOpen(!isReviewOpen)}
            className="w-full flex items-center justify-between py-4 font-bold text-base text-[#181725] text-left hover:text-[#53B175] transition-colors"
          >
            <span>Review</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'w-4 h-4',
                      i < Math.round(product.rating) ? 'fill-amber-400 stroke-none' : 'fill-gray-200 stroke-none'
                    )}
                  />
                ))}
              </div>
              {isReviewOpen
                ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </div>
          </button>
          {isReviewOpen && (
            <div className="pb-4 animate-fade-in space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={clsx(
                        'w-5 h-5',
                        i < Math.round(product.rating) ? 'fill-amber-400 stroke-none' : 'fill-gray-200 stroke-none'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-extrabold text-[#181725]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#7C7C7C]">({product.reviewsCount} reviews)</span>
              </div>

              {/* Sample reviews */}
              {[
                { author: 'Sarah M.', text: 'Extremely fresh product! Delivered super fast in great condition.' },
                { author: 'James K.', text: 'Great quality, exactly as described. Will order again!' },
              ].map((review) => (
                <div key={review.author} className="bg-[#F8F9FA] rounded-xl p-3">
                  <p className="text-xs font-bold text-[#181725] mb-1">{review.author}</p>
                  <p className="text-xs text-[#7C7C7C] leading-relaxed">&quot;{review.text}&quot;</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add To Basket CTA ──
          Mobile: fixed to bottom of screen
          Desktop: inline below accordions  */}
      <div className="hidden md:block mt-6">
        <PillButton onClick={handleAddToCart} size="lg">
          {isAdded ? (
            <span className="flex items-center justify-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Added to Basket!</span>
            </span>
          ) : (
            'Add To Basket'
          )}
        </PillButton>
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] z-30">
        <PillButton onClick={handleAddToCart} size="lg">
          {isAdded ? (
            <span className="flex items-center justify-center space-x-2">
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
