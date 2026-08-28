import React from 'react';
import { Search, MapPin, ShoppingCart, Heart, User } from 'lucide-react';
import { TabType } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { useAuthStore } from '../../stores/useAuthStore';
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
    { id: 'cart', label: 'Cart' },
    { id: 'favourite', label: 'Favourites' },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2F3F2] shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo Lockup */}
        <div
          onClick={() => onTabChange('shop')}
          className="flex items-center space-x-2.5 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl p-1"
          tabIndex={0}
          role="button"
        >
          {/* Carrot Logo Mark */}
          <div className="bg-white p-1 rounded-xl shadow-xs">
            <img
              src="/images/ICON_1.png"
              alt="Nectar Logo"
              className="w-8 h-9 object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#181725] tracking-tight group-hover:text-[#53B175] transition-colors">
              nectar
            </span>
            <span className="block text-[10px] text-[#7C7C7C] font-semibold -mt-1 tracking-wider uppercase">
              Online Groceries
            </span>
          </div>
        </div>

        {/* Location Picker pill */}
        <button
          type="button"
          onClick={onOpenLocation}
          className="flex items-center space-x-2 bg-[#F2F3F2]/80 hover:bg-[#F2F3F2] px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#181725] transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <MapPin className="w-4 h-4 text-[#53B175]" />
          <span>
            {userLocation.area}, {userLocation.city}
          </span>
        </button>

        {/* Global Desktop Search Trigger */}
        <div className="flex-1 max-w-xs lg:max-w-md relative">
          <div
            onClick={onOpenSearch}
            className="w-full bg-[#F2F3F2] hover:bg-[#E5E7E5] text-[#7C7C7C] h-11 pl-11 pr-4 rounded-2xl flex items-center text-sm font-semibold cursor-pointer transition-colors overflow-hidden"
          >
            <Search className="w-5 h-5 text-gray-500 absolute left-3.5 shrink-0" />
            <span className="truncate whitespace-nowrap">Search store, fruits, beverages...</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#53B175]',
                  isActive
                    ? 'bg-[#EEF8F2] text-[#53B175]'
                    : 'text-[#181725] hover:bg-gray-100 hover:text-[#53B175]'
                )}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons (Favourites, Cart, Auth) */}
        <div className="flex items-center space-x-3 border-l border-[#F2F3F2] pl-4">
          {/* Favorites Button */}
          <button
            onClick={() => onTabChange('favourite')}
            className="relative p-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Favorites"
          >
            <Heart className="w-6 h-6" />
            {favoriteIds.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => onTabChange('cart')}
            className="relative p-2.5 text-gray-700 hover:text-[#53B175] hover:bg-gray-100 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#53B175] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                onTabChange('account');
              } else {
                onOpenAuth();
              }
            }}
            className="flex items-center space-x-2 bg-[#53B175]/10 hover:bg-[#53B175]/20 text-[#53B175] px-4 py-2.5 rounded-2xl font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <User className="w-5 h-5" />
            <span>{isAuthenticated ? userProfile?.name.split(' ')[0] : 'Demo Log In'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
