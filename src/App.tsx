import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { SplashPage } from './pages/auth/SplashPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { SignInWelcomePage } from './pages/auth/SignInWelcomePage';
import { EnterNumberPage } from './pages/auth/EnterNumberPage';
import { VerificationPage } from './pages/auth/VerificationPage';
import { SelectLocationPage } from './pages/auth/SelectLocationPage';
import { LogInPage } from './pages/auth/LogInPage';
import { SignUpPage } from './pages/auth/SignUpPage';

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
import { ToastContainer } from './components/common/ToastContainer';

import { Category, TabType, Product } from './types';
import { useAuthStore } from './stores/useAuthStore';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './api/productsData';

// Helper Route Wrapper for Category Listing
function CategoryRouteWrapper({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = INITIAL_CATEGORIES.find((c: Category) => c.id === id);

  if (!category) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <CategoryListingPage
      category={category}
      onBack={() => navigate(-1)}
      onSelectProduct={(product) => {
        onSelectProduct(product);
        navigate(`/product/${product.id}`);
      }}
    />
  );
}

// Helper Route Wrapper for Product Details
function ProductRouteWrapper({ allProducts }: { allProducts: Product[] }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return <ProductDetailPage product={product} onBack={() => navigate(-1)} />;
}

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasCompletedOnboarding, isAuthenticated, setCompletedOnboarding, login, openAuthModal } =
    useAuthStore();

  // Modals
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrderFailureOpen, setIsOrderFailureOpen] = useState(false);

  // Synchronize URL path to Active Tab state
  const getActiveTabFromPath = (): TabType => {
    const path = location.pathname;
    if (path.startsWith('/explore') || path.startsWith('/category')) return 'explore';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/favourite')) return 'favourite';
    if (path.startsWith('/account')) return 'account';
    return 'shop';
  };

  const activeTab = getActiveTabFromPath();

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'shop':
        navigate('/');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'favourite':
        navigate('/favourite');
        break;
      case 'account':
        navigate('/account');
        break;
    }
  };

  const handleCompleteAuthSequence = () => {
    login('user@nectar.com', 'Demo Customer');
    setCompletedOnboarding(true);
    navigate('/');
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Auth & Splash Standalone Routes
  if (location.pathname === '/splash') {
    return (
      <SplashPage
        onFinish={() => {
          if (!hasCompletedOnboarding) {
            navigate('/onboarding');
          } else {
            navigate('/');
          }
        }}
      />
    );
  }

  if (location.pathname === '/onboarding') {
    return <OnboardingPage onGetStarted={() => navigate('/signin')} />;
  }

  if (location.pathname === '/signin') {
    return (
      <SignInWelcomePage
        onBack={() => navigate('/')}
        onSelectPhone={() => navigate('/enter-phone')}
        onGoogleSignIn={handleCompleteAuthSequence}
        onFacebookSignIn={handleCompleteAuthSequence}
        onEmailSignIn={() => navigate('/login')}
      />
    );
  }

  if (location.pathname === '/enter-phone') {
    return (
      <EnterNumberPage
        onBack={() => navigate('/signin')}
        onSubmit={() => navigate('/otp-verification')}
      />
    );
  }

  if (location.pathname === '/otp-verification') {
    return (
      <VerificationPage
        onBack={() => navigate('/enter-phone')}
        onSubmit={() => navigate('/select-location')}
      />
    );
  }

  if (location.pathname === '/select-location') {
    return (
      <SelectLocationPage
        onBack={() => navigate('/otp-verification')}
        onSubmit={handleCompleteAuthSequence}
      />
    );
  }

  if (location.pathname === '/login') {
    return (
      <LogInPage
        onBack={() => navigate('/signin')}
        onSuccess={(email) => {
          login(email, 'Imran Hossain');
          navigate('/');
        }}
        onGoToSignUp={() => navigate('/signup')}
      />
    );
  }

  if (location.pathname === '/signup') {
    return (
      <SignUpPage
        onBack={() => navigate('/login')}
        onSuccess={(name, email) => {
          login(email, name);
          navigate('/');
        }}
        onGoToLogIn={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#181725] flex flex-col font-sans selection:bg-[#53B175]/30">
      {/* Toast Notification Floating Container */}
      <ToastContainer />

      {/* Desktop Header Navbar */}
      <NavbarDesktop
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenAuth={() => {
          if (!isAuthenticated) {
            navigate('/signin');
          } else {
            openAuthModal();
          }
        }}
        onOpenSearch={() => navigate('/explore')}
      />

      {/* Main Responsive Content Shell */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-12">
        <div className="max-w-md mx-auto md:max-w-none">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onSelectProduct={(product) => navigate(`/product/${product.id}`)}
                  onNavigateTab={handleTabChange}
                  onSelectCategory={(category) => navigate(`/category/${category.id}`)}
                  onOpenLocation={() => setIsLocationOpen(true)}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <SearchPage
                  onSelectProduct={(product) => navigate(`/product/${product.id}`)}
                  onSelectCategory={(category) => navigate(`/category/${category.id}`)}
                />
              }
            />
            <Route
              path="/category/:id"
              element={
                <CategoryRouteWrapper
                  onSelectProduct={(product) => navigate(`/product/${product.id}`)}
                />
              }
            />
            <Route
              path="/product/:id"
              element={<ProductRouteWrapper allProducts={INITIAL_PRODUCTS} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  onGoToCheckout={handleCheckoutClick}
                  onExplore={() => navigate('/explore')}
                />
              }
            />
            <Route
              path="/favourite"
              element={
                <FavouritesPage
                  onSelectProduct={(product) => navigate(`/product/${product.id}`)}
                  onExplore={() => navigate('/explore')}
                />
              }
            />
            <Route
              path="/account"
              element={
                <AccountPage
                  initialSection="menu"
                  onOpenAuth={() => {
                    if (!isAuthenticated) {
                      navigate('/signin');
                    } else {
                      openAuthModal();
                    }
                  }}
                />
              }
            />
            <Route
              path="/account/orders"
              element={
                <AccountPage
                  initialSection="orders"
                  onOpenAuth={() => {
                    if (!isAuthenticated) {
                      navigate('/signin');
                    } else {
                      openAuthModal();
                    }
                  }}
                />
              }
            />
            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Global Modals & Dialogs */}
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
          navigate('/account/orders');
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
