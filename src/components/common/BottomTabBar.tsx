import React from 'react';
import { Store, Compass, ShoppingCart, Heart, User } from 'lucide-react';
import { TabType } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { clsx } from 'clsx';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'favourite', label: 'Favourite', icon: Heart },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] rounded-t-2xl shadow-lg max-w-md mx-auto sm:max-w-none md:hidden"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center flex-1 h-full transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl',
                isActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
              )}
            >
              <div className="relative">
                <Icon className={clsx('w-6 h-6 stroke-[1.8]', isActive && 'stroke-[2.2]')} />
                {tab.id === 'cart' && totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#53B175] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-fade-in">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </div>
              <span className={clsx('text-xs mt-1 font-semibold', isActive ? 'font-bold' : 'font-medium')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
