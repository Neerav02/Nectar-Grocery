import React from 'react';
import { PillButton } from '../../components/common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';
import { Clock, ShieldCheck, ShoppingBag } from 'lucide-react';

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
    <div className="relative min-h-screen w-full bg-[#181725] text-white flex flex-col justify-center select-none overflow-hidden">
      {/* Ambient Lighting Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#53B175]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#53B175]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Responsive Layout: Full Bleed Mobile ➔ 2-Column Split Desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen lg:min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 lg:p-6 items-center">
        
        {/* LEFT SHOWCASE: Original Delivery Courier Image & Grocery Collage */}
        <div className="lg:col-span-7 relative h-[52vh] sm:h-[58vh] lg:h-[78vh] w-full overflow-hidden lg:rounded-3xl shadow-2xl bg-black/40 border border-white/10 group">
          {/* Delivery Courier Hero Image — Cropped to top to eliminate hardcoded text glitch */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/onboarding.png"
              alt="Nectar Delivery Courier"
              className="w-full h-[135%] object-cover object-top transform scale-110 -translate-y-2 transition-transform duration-700 group-hover:scale-115"
            />
            {/* Seamless Ambient Gradient Blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181725] via-[#181725]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#181725]/30 lg:to-[#181725]" />
          </div>

          {/* Floating Category Collage Cards (Visible on Desktop / Tablet) */}
          <div className="hidden sm:flex absolute bottom-6 left-6 right-6 gap-3 z-20">
            {/* Fresh Vegetables Card */}
            <div className="flex-1 bg-black/70 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center gap-3 shadow-xl">
              <img 
                src="/images/banner_vegetables.png" 
                alt="Fresh Vegetables" 
                className="w-12 h-12 object-cover rounded-xl shrink-0" 
              />
              <div>
                <p className="text-xs font-bold text-white leading-tight">Fresh Vegetables</p>
                <p className="text-[10px] text-[#53B175] font-semibold">100% Organic Certified</p>
              </div>
            </div>

            {/* Summer Fruits Card */}
            <div className="flex-1 bg-black/70 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center gap-3 shadow-xl">
              <img 
                src="/images/banner_fruits.png" 
                alt="Summer Fruits" 
                className="w-12 h-12 object-cover rounded-xl shrink-0" 
              />
              <div>
                <p className="text-xs font-bold text-white leading-tight">Summer Fruits</p>
                <p className="text-[10px] text-orange-400 font-semibold">Daily Farm Harvest</p>
              </div>
            </div>

            {/* Express Delivery Badge */}
            <div className="hidden md:flex flex-1 bg-[#53B175]/90 backdrop-blur-md p-3 rounded-2xl items-center gap-3 shadow-xl text-white">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Express 15m</p>
                <p className="text-[10px] text-white/90 font-medium">Fast Doorstep Dispatch</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Nectar Brand Lockup, Single Typography & Action CTA */}
        <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 py-8 lg:py-12 text-center lg:text-left z-20">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-12 h-14 flex items-center justify-center filter drop-shadow-md">
              <img src="/images/Icon.png" alt="Nectar Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">nectar</span>
          </div>

          {/* Crisp Single-Layer Headline (Zero text duplication) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
            Welcome <br className="hidden sm:inline" />
            <span className="text-[#53B175]">to our store</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-300 font-medium mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Get your fresh daily groceries delivered to your doorstep in as fast as one hour.
          </p>

          {/* Value Proposition Highlights */}
          <div className="hidden lg:grid grid-cols-1 gap-3 mb-8 text-left">
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-200 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-[#53B175] shrink-0" />
              <span>Superfast 60-Minute Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-200 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-[#53B175] shrink-0" />
              <span>100% Quality Inspected & Organic Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-200 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5 text-[#53B175] shrink-0" />
              <span>Zero Minimum Order Limit & Real-time Live Tracking</span>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <PillButton onClick={handleStart} size="lg" className="w-full shadow-2xl hover:scale-[1.02] transition-transform">
              Get Started
            </PillButton>
          </div>
        </div>

      </div>
    </div>
  );
};
