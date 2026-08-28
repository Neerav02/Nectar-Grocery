import { useState } from 'react';
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

import { Category, Product, TabType } from './types';
import { useAuthStore } from './stores/useAuthStore';

type OnboardingStep =
  | 'splash'
  | 'onboarding'
  | 'signin_welcome'
  | 'enter_phone'
  | 'otp_verification'
  | 'select_location'
  | 'login_email'
  | 'signup_email'
  | 'main_app';

export function App() {
  const { hasCompletedOnboarding, isAuthenticated, setCompletedOnboarding, login, openAuthModal } =
    useAuthStore();

  // Always start at 'splash' on every page refresh so Splash screen always displays first
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');

  // Active Main App Tab Navigation
  const [activeTab, setActiveTab] = useState<TabType>('shop');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isOrderFailureOpen, setIsOrderFailureOpen] = useState(false);

  // Flow Step Handlers
  const handleSplashFinish = () => {
    if (!hasCompletedOnboarding) {
      setCurrentStep('onboarding');
    } else {
      setCurrentStep('main_app');
    }
  };

  const handleCompleteAuthSequence = () => {
    login('user@nectar.com', 'Demo Customer');
    setCompletedOnboarding(true);
    setCurrentStep('main_app');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const handleCheckoutClick = () => {
    // Rule: Without login, no one can place an order!
    if (!isAuthenticated) {
      setCurrentStep('signin_welcome');
      return;
    }
    setIsCheckoutOpen(true);
  };

  // 1. Splash Screen (Plays on every page refresh for 1.8s)
  if (currentStep === 'splash') {
    return <SplashPage onFinish={handleSplashFinish} />;
  }

  // 2. Onboarding Page (Delivery Person Photo + Logo)
  if (currentStep === 'onboarding') {
    return <OnboardingPage onGetStarted={() => setCurrentStep('signin_welcome')} />;
  }

  // 3. Sign In Welcome Screen (Sing in.png)
  if (currentStep === 'signin_welcome') {
    return (
      <SignInWelcomePage
        onSelectPhone={() => setCurrentStep('enter_phone')}
        onGoogleSignIn={handleCompleteAuthSequence}
        onFacebookSignIn={handleCompleteAuthSequence}
      />
    );
  }

  // 4. Enter Mobile Number (Number.png)
  if (currentStep === 'enter_phone') {
    return (
      <EnterNumberPage
        onBack={() => setCurrentStep('signin_welcome')}
        onSubmit={() => setCurrentStep('otp_verification')}
      />
    );
  }

  // 5. Verification / OTP Code (Verification.png)
  if (currentStep === 'otp_verification') {
    return (
      <VerificationPage
        onBack={() => setCurrentStep('enter_phone')}
        onSubmit={() => setCurrentStep('select_location')}
      />
    );
  }

  // 6. Select Location (select location.png)
  if (currentStep === 'select_location') {
    return (
      <SelectLocationPage
        onBack={() => setCurrentStep('otp_verification')}
        onSubmit={handleCompleteAuthSequence}
      />
    );
  }

  // 7. Email Login Screen (log in.png)
  if (currentStep === 'login_email') {
    return (
      <LogInPage
        onBack={() => setCurrentStep('signin_welcome')}
        onSuccess={(email) => {
          login(email, 'Imran Hossain');
          setCurrentStep('main_app');
        }}
        onGoToSignUp={() => setCurrentStep('signup_email')}
      />
    );
  }

  // 8. Email Sign Up Screen (sign up.png)
  if (currentStep === 'signup_email') {
    return (
      <SignUpPage
        onBack={() => setCurrentStep('login_email')}
        onSuccess={(name, email) => {
          login(email, name);
          setCurrentStep('main_app');
        }}
        onGoToLogIn={() => setCurrentStep('login_email')}
      />
    );
  }

  // 9. Main Application View
  return (
    <div className="min-h-screen bg-white text-[#181725] flex flex-col font-sans selection:bg-[#53B175]/30">
      {/* Desktop Header Navbar */}
      <NavbarDesktop
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenAuth={() => {
          if (!isAuthenticated) {
            setCurrentStep('signin_welcome');
          } else {
            openAuthModal();
          }
        }}
        onOpenSearch={() => handleTabChange('explore')}
      />

      {/* Main Responsive Content Shell */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-12">
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
              onSelectProduct={setSelectedProduct}
            />
          ) : activeTab === 'shop' ? (
            <HomePage
              onSelectProduct={setSelectedProduct}
              onNavigateTab={handleTabChange}
              onSelectCategory={setSelectedCategory}
              onOpenLocation={() => setIsLocationOpen(true)}
            />
          ) : activeTab === 'explore' ? (
            <SearchPage onSelectProduct={setSelectedProduct} />
          ) : activeTab === 'cart' ? (
            <CartPage
              onGoToCheckout={handleCheckoutClick}
              onExplore={() => handleTabChange('explore')}
            />
          ) : activeTab === 'favourite' ? (
            <FavouritesPage
              onSelectProduct={setSelectedProduct}
              onExplore={() => handleTabChange('explore')}
            />
          ) : (
            <AccountPage
              onOpenAuth={() => {
                if (!isAuthenticated) {
                  setCurrentStep('signin_welcome');
                } else {
                  openAuthModal();
                }
              }}
            />
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
