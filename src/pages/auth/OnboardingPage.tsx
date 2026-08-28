import React from 'react';
import { PillButton } from '../../components/common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';

interface OnboardingPageProps {
  onGetStarted: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onGetStarted }) => {
  const setCompletedOnboarding = useAuthStore((state) => state.setCompletedOnboarding);

  const handleStart = () => {
    setCompletedOnboarding(true);
    onGetStarted();
  };

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-end items-center text-white select-none overflow-hidden">
      {/* High-Definition Fullscreen Clean Grocery Background (Zero hardcoded image text) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=85')`,
        }}
      />

      {/* Dark Ambient Gradient Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 backdrop-blur-[1px]" />

      {/* Hero Card Container — Responsive across Mobile and Widescreen Desktop */}
      <div className="relative z-10 p-8 sm:p-12 max-w-xl w-full text-center pb-16 sm:pb-20 animate-fade-in flex flex-col items-center">
        {/* Nectar White Carrot Brand Logo */}
        <div className="w-14 h-16 mb-5 flex items-center justify-center filter drop-shadow-xl transform hover:scale-110 transition-transform">
          <img 
            src="/images/Icon.png" 
            alt="Nectar Logo" 
            className="w-full h-full object-contain brightness-0 invert" 
          />
        </div>

        {/* Clean Single Headline (No duplicated text overlay) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-3 tracking-tight drop-shadow-xl">
          Welcome <br /> to our store
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-gray-200 mb-9 max-w-sm leading-relaxed drop-shadow-md">
          Get your groceries in as fast as one hour
        </p>

        {/* Action Button */}
        <div className="w-full max-w-xs sm:max-w-sm">
          <PillButton onClick={handleStart} size="lg" className="w-full shadow-2xl hover:scale-[1.02] transition-transform">
            Get Started
          </PillButton>
        </div>
      </div>
    </div>
  );
};
