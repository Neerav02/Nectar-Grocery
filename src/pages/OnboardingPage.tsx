import React from 'react';
import { Sparkles } from 'lucide-react';
import { PillButton } from '../components/common/PillButton';
import { useAuthStore } from '../stores/useAuthStore';

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
    <div className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-end text-white select-none overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80')`,
      }}
    >
      <div className="p-8 max-w-md mx-auto w-full text-center pb-12 animate-fade-in flex flex-col items-center">
        {/* Carrot Icon Lockup */}
        <div className="w-14 h-14 rounded-2xl bg-[#53B175] flex items-center justify-center text-white mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 fill-white stroke-none" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3 tracking-tight">
          Welcome <br /> to our store
        </h2>

        <p className="text-sm font-medium text-gray-300 mb-8 max-w-xs leading-relaxed">
          Get your groceries in as fast as one hour
        </p>

        <PillButton onClick={handleStart} size="lg">
          Get Started
        </PillButton>
      </div>
    </div>
  );
};
