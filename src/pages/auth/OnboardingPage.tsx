import React from 'react';
import { PillButton } from '../../components/common/PillButton';

interface OnboardingPageProps {
  onGetStarted: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onGetStarted }) => {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-end text-white select-none overflow-hidden max-w-md mx-auto shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.05) 100%), url('/images/onboarding.png')`,
      }}
    >
      <div className="p-8 w-full text-center pb-12 animate-fade-in flex flex-col items-center">
        {/* Dark overlay bg — use white Icon.png */}
        <img src="/images/Icon.png" alt="Nectar" className="w-12 h-14 object-contain mb-4 drop-shadow-md brightness-0 invert" />

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3 tracking-tight">
          Welcome <br /> to our store
        </h2>

        <p className="text-sm font-medium text-gray-300 mb-8 max-w-xs leading-relaxed">
          Get your groceries in as fast as one hour
        </p>

        <PillButton onClick={onGetStarted} size="lg">
          Get Started
        </PillButton>
      </div>
    </div>
  );
};
