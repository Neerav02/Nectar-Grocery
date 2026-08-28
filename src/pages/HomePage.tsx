import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProductGrid } from '../components/product/ProductGrid';
import { Product, Category, TabType } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../api/productsData';
import { useAuthStore } from '../stores/useAuthStore';
import { clsx } from 'clsx';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateTab: (tab: TabType) => void;
  onSelectCategory: (category: Category) => void;
  onOpenLocation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onNavigateTab,
  onSelectCategory,
  onOpenLocation,
}) => {
  const { userLocation } = useAuthStore();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Auto banner rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const exclusiveProducts = INITIAL_PRODUCTS.filter((p) => p.isExclusive);
  const bestSellingProducts = INITIAL_PRODUCTS.filter((p) => p.isBestSelling);

  const banners = [
    {
      title: 'Fresh Vegetables',
      subtitle: 'Get Up To 40% OFF',
      bg: 'from-emerald-700 to-teal-900',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Juicy Summer Fruits',
      subtitle: '100% Organic & Farm Fresh',
      bg: 'from-amber-600 to-orange-800',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Dairy & Morning Bakery',
      subtitle: 'Fresh Milk & Brown Eggs',
      bg: 'from-blue-600 to-indigo-900',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Mobile Top Header (Carrot Icon + Location) */}
      <div className="md:hidden flex flex-col items-center pt-2">
        <div className="bg-white p-1 rounded-xl shadow-xs mb-2">
          <img
            src="/images/ICON_1.png"
            alt="Nectar Logo"
            className="w-8 h-9 object-contain"
          />
        </div>
        <button
          type="button"
          onClick={onOpenLocation}
          className="flex items-center space-x-1.5 text-[#181725] font-bold text-sm hover:text-[#53B175] transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-2 py-1"
        >
          <MapPin className="w-4 h-4 text-[#53B175]" />
          <span>
            {userLocation.area}, {userLocation.city}
          </span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div
          onClick={() => onNavigateTab('explore')}
          className="w-full bg-[#F2F3F2] hover:bg-[#E5E7E5] h-13 pl-12 pr-4 rounded-2xl flex items-center text-sm text-[#7C7C7C] font-medium cursor-pointer transition-colors"
        >
          <Search className="w-5 h-5 text-gray-500 absolute left-4" />
          <span>Search Store</span>
        </div>
      </div>

      {/* Promo Banner Carousel */}
      <div className="relative overflow-hidden rounded-3xl shadow-sm border border-[#E2E2E2]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
        >
          {banners.map((b, i) => (
            <div
              key={i}
              className={clsx(
                'min-w-full h-44 sm:h-52 bg-gradient-to-r p-6 sm:p-8 text-white flex items-center justify-between relative overflow-hidden',
                b.bg
              )}
            >
              <div className="max-w-[60%] z-10">
                <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wider">
                  Special Deal
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
                  {b.title}
                </h3>
                <p className="text-sm font-semibold text-emerald-200">{b.subtitle}</p>
              </div>

              <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-90">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover rounded-full filter drop-shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center space-x-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBannerIndex(i)}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                activeBannerIndex === i ? 'w-6 bg-[#53B175]' : 'w-2 bg-white/60 hover:bg-white'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Exclusive Offer Section */}
      <section>
        <SectionHeader title="Exclusive Offer" onSeeAll={() => onNavigateTab('explore')} />
        <ProductGrid
          products={exclusiveProducts}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* Best Selling Section */}
      <section>
        <SectionHeader title="Best Selling" onSeeAll={() => onNavigateTab('explore')} />
        <ProductGrid
          products={bestSellingProducts}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* Groceries Categories Section */}
      <section>
        <SectionHeader title="Groceries" onSeeAll={() => onNavigateTab('explore')} />
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
          {INITIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              style={{ backgroundColor: cat.fillBg, borderColor: cat.borderColor }}
              className="flex-shrink-0 w-64 p-4 rounded-2xl border flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-xl group-hover:scale-110 transition-transform"
              />
              <span className="font-bold text-[#181725] text-base leading-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
