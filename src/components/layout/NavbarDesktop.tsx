import React from 'react';
import { Search, MapPin, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { TabType } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { AuditModeBadge } from '../common/AuditModeBadge';
import { clsx } from 'clsx';

interface NavbarDesktopProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenLocation: () => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

export const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  activeTab,
  onTabChange,
  onOpenLocation,
  onOpenAuth,
  onOpenSearch,
}) => {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { userLocation, isAuthenticated, userProfile } = useAuthStore();

  const navLinks: { id: TabType; label: string }[] = [
    { id: 'shop', label: 'Shop' },
    { id: 'explore', label: 'Explore' },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2F3F2] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-6">
        
        {/* ── Left Section: Brand Logo & Location Pill ── */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Brand Logo */}
          <div
            onClick={() => onTabChange('shop')}
            className="flex items-center space-x-2.5 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl p-1 select-none"
            tabIndex={0}
            role="button"
          >
            <img
              src="/images/ICON_1.png"
              alt="Nectar Logo"
              className="w-9 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl lg:text-3xl font-extrabold text-[#181725] tracking-tight group-hover:text-[#53B175] transition-colors leading-none">
              nectar
            </span>
          </div>

          <div className="h-6 w-px bg-[#F2F3F2]" />

          {/* Location Picker Pill */}
          <button
            type="button"
            onClick={onOpenLocation}
            className="flex items-center space-x-2 bg-[#F2F3F2]/80 hover:bg-[#F2F3F2] px-3 py-2 rounded-2xl text-xs font-bold text-[#181725] transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] max-w-[180px] lg:max-w-[220px] truncate"
            title="Change Delivery Location"
          >
            <MapPin className="w-4 h-4 text-[#53B175] shrink-0" />
            <span className="truncate">
              {userLocation.area}{userLocation.city ? `, ${userLocation.city}` : ''}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
          </button>
        </div>

        {/* ── Center Section: Global Search Bar & Main Nav Links ── */}
        <div className="flex items-center space-x-4 flex-1 max-w-xl mx-2">
          {/* Search Trigger Input */}
          <div
            onClick={onOpenSearch}
            className="flex-1 bg-[#F2F3F2] hover:bg-[#E5E7E5] text-[#7C7C7C] h-10 pl-10 pr-4 rounded-2xl flex items-center text-xs font-semibold cursor-pointer transition-all shadow-2xs border border-transparent hover:border-gray-200 overflow-hidden relative"
          >
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 shrink-0" />
            <span className="truncate">Search store, fruits, beverages...</span>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center space-x-1 shrink-0">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={clsx(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#53B175]',
                    isActive
                      ? 'bg-[#EEF8F2] text-[#53B175] shadow-2xs'
                      : 'text-[#181725] hover:bg-gray-100 hover:text-[#53B175]'
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Right Section: Evaluator Mode, Favorites, Cart & Auth Profile ── */}
        <div className="flex items-center space-x-2.5 lg:space-x-3 shrink-0">
          {/* Evaluator Audit Mode Toggle Badge */}
          <AuditModeBadge />

          <div className="h-6 w-px bg-[#F2F3F2]" />

          {/* Favorites Wishlist Icon */}
          <button
            onClick={() => onTabChange('favourite')}
            className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Favorites"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoriteIds.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Icon */}
          <button
            onClick={() => onTabChange('cart')}
            className="relative p-2 text-gray-700 hover:text-[#53B175] hover:bg-[#EEF8F2] rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Cart"
            title="My Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#53B175] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                onTabChange('account');
              } else {
                onOpenAuth();
              }
            }}
            className="flex items-center space-x-2 bg-[#53B175]/10 hover:bg-[#53B175]/20 text-[#53B175] h-10 px-3.5 rounded-2xl font-bold text-xs transition-all focus-visible:ring-2 focus-visible:ring-[#53B175] shadow-2xs whitespace-nowrap"
          >
            <User className="w-4 h-4" />
            <span>{isAuthenticated ? userProfile?.name.split(' ')[0] : 'Demo Log In'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
