import { useState } from 'react';
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { CategoryListingPage } from './pages/CategoryListingPage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { AccountPage } from './pages/AccountPage';

import { NavbarDesktop } from './components/layout/NavbarDesktop';
import { BottomTabBar } from './components/common/BottomTabBar';
import { LocationModal } from './components/auth/LocationModal';
import { AuthModal } from './components/auth/AuthModal';
import { FilterSheet } from './components/filter/FilterSheet';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderSuccessModal } from './components/cart/OrderSuccessModal';
import { OrderFailureModal } from './components/cart/OrderFailureModal';

import { Category, Product, TabType } from './types';
import { useAuthStore } from './stores/useAuthStore';

export function App() {
  // App Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const { hasCompletedOnboarding } = useAuthStore();
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  // Active View Navigation
  const [activeTab, setActiveTab] = useState<TabType>('shop');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrderFailureOpen, setIsOrderFailureOpen] = useState(false);

  // Handlers
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  if (showSplash) {
    return <SplashPage onFinish={() => setShowSplash(false)} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingPage onGetStarted={() => setActiveTab('shop')} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#181725] flex flex-col font-sans selection:bg-[#53B175]/30">
      {/* Desktop Header Navbar */}
      <NavbarDesktop
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenAuth={() => openAuthModal()}
        onOpenSearch={() => handleTabChange('explore')}
      />

      {/* Main Responsive Content Shell */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-8">
        <div className="max-w-md mx-auto md:max-w-none">
          {selectedProduct ? (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
          ) : selectedCategory ? (
            <CategoryListingPage
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
              onSelectProduct={handleSelectProduct}
            />
          ) : activeTab === 'shop' ? (
            <HomePage
              onSelectProduct={handleSelectProduct}
              onNavigateTab={handleTabChange}
              onSelectCategory={handleSelectCategory}
              onOpenLocation={() => setIsLocationOpen(true)}
            />
          ) : activeTab === 'explore' ? (
            <SearchPage onSelectProduct={handleSelectProduct} />
          ) : activeTab === 'cart' ? (
            <CartPage
              onGoToCheckout={() => setIsCheckoutOpen(true)}
              onExplore={() => handleTabChange('explore')}
            />
          ) : activeTab === 'favourite' ? (
            <FavouritesPage
              onSelectProduct={handleSelectProduct}
              onExplore={() => handleTabChange('explore')}
            />
          ) : (
            <AccountPage onOpenAuth={() => openAuthModal()} />
          )}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Global Modals & Bottom Sheets */}
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <AuthModal />
      <FilterSheet />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => setIsOrderSuccessOpen(true)}
        onFailure={() => setIsOrderFailureOpen(true)}
      />
      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        onTrackOrder={() => {
          setIsOrderSuccessOpen(false);
          handleTabChange('account');
        }}
      />
      <OrderFailureModal
        isOpen={isOrderFailureOpen}
        onClose={() => setIsOrderFailureOpen(false)}
        onRetry={() => {
          setIsOrderFailureOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
    </div>
  );
}

export default App;
