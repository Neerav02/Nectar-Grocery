import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingBag, Flame, Leaf } from 'lucide-react';
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

  // Simulated live order count that ticks up every few seconds
  const [orderCount, setOrderCount] = useState(2847);
  useEffect(() => {
    const counter = setInterval(() => {
      setOrderCount((prev) => prev + Math.floor(Math.random() * 3 + 1));
    }, 3500);
    return () => clearInterval(counter);
  }, []);

  const banners = [
    {
      id: 0,
      categoryId: 'fruits-veg',
      badge: 'Limited Deal',
      badgeColor: 'bg-[#53B175]',
      title: 'Fresh Vegetables',
      titleHighlight: 'Up to 40% OFF',
      subtitle: 'Farm-to-table organic greens, delivered in under 1 hour.',
      discount: '40%',
      accentColor: 'from-emerald-900/80 via-emerald-800/60 to-transparent',
      image: '/images/banner_vegetables.png',
      stat: { icon: Leaf, label: 'organic items', value: '500+' },
      cta: 'Shop Vegetables',
    },
    {
      id: 1,
      categoryId: 'fruits-veg',
      badge: 'Summer Special',
      badgeColor: 'bg-orange-500',
      title: 'Juicy Summer Fruits',
      titleHighlight: '100% Farm Fresh',
      subtitle: 'Handpicked tropical fruits, rich in vitamins and taste.',
      discount: '25%',
      accentColor: 'from-orange-900/85 via-orange-800/55 to-transparent',
      image: '/images/banner_fruits.png',
      stat: { icon: Flame, label: 'orders today', value: orderCount.toLocaleString() },
      cta: 'Shop Fruits',
    },
    {
      id: 2,
      categoryId: 'dairy-eggs',
      badge: 'Daily Fresh',
      badgeColor: 'bg-blue-500',
      title: 'Dairy & Morning Bakery',
      titleHighlight: 'Fresh Every Morning',
      subtitle: 'Pure milk, artisan bread and farm eggs at your door.',
      discount: '15%',
      accentColor: 'from-indigo-900/85 via-indigo-800/55 to-transparent',
      image: '/images/banner_dairy.png',
      stat: { icon: ShoppingBag, label: 'happy customers', value: '12k+' },
      cta: 'Shop Dairy',
    },
  ];

  const handleBannerClick = (catId: string) => {
    const targetCategory = INITIAL_CATEGORIES.find((c) => c.id === catId);
    if (targetCategory) {
      onSelectCategory(targetCategory);
    } else {
      onNavigateTab('explore');
    }
  };

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

      {/* ── Interactive Hero Banner Carousel ── */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-[#E9EAEC] bg-[#181725] group">
        <div
          className="flex transition-transform duration-700 ease-out h-52 sm:h-64 md:h-72"
          style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
        >
          {banners.map((b) => {
            const StatIcon = b.stat.icon;
            return (
              <div
                key={b.id}
                onClick={() => handleBannerClick(b.categoryId)}
                className="w-full flex-shrink-0 relative h-full cursor-pointer select-none"
              >
                {/* Full cover edge-to-edge banner background photo */}
                <img
                  src={b.image}
                  alt={b.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  draggable={false}
                />

                {/* Left-to-right dark gradient overlay so text is readable */}
                <div
                  className={clsx(
                    'absolute inset-0 bg-gradient-to-r',
                    b.accentColor
                  )}
                />

                {/* Banner Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-7">
                  {/* Top row: Badge + Discount tag */}
                  <div className="flex items-start justify-between">
                    {/* Badge pill */}
                    <span
                      className={clsx(
                        'inline-flex items-center text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-md',
                        b.badgeColor
                      )}
                    >
                      {b.badge}
                    </span>

                    {/* Discount bubble */}
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl px-3 py-1 text-center shadow-lg">
                      <p className="text-xl font-extrabold leading-none">{b.discount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">OFF</p>
                    </div>
                  </div>

                  {/* Middle: Title & subtitle */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                      {b.title}
                    </h2>
                    <p className="text-sm font-semibold text-white/80 mt-1 max-w-xs leading-snug drop-shadow">
                      {b.subtitle}
                    </p>
                  </div>

                  {/* Bottom row: Live stat counter + CTA */}
                  <div className="flex items-end justify-between">
                    {/* Animated live-stat badge */}
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/20 text-white rounded-xl px-3 py-1.5 shadow">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#53B175] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#53B175]" />
                      </span>
                      <StatIcon className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-xs font-extrabold">
                        <span className="text-[#53B175]">{b.stat.value}</span>{' '}
                        <span className="text-white/80 font-semibold">{b.stat.label}</span>
                      </span>
                    </div>

                    {/* Shop Now CTA Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(b.categoryId);
                      }}
                      className="bg-white text-[#181725] text-xs font-extrabold px-4 py-2 rounded-xl shadow-md hover:bg-[#53B175] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      {b.cta} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setActiveBannerIndex(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                activeBannerIndex === i
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              )}
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
