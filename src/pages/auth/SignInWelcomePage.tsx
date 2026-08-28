import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SignInWelcomePageProps {
  onBack?: () => void;
  onSelectPhone: () => void;
  onGoogleSignIn: () => void;
  onFacebookSignIn: () => void;
}

export const SignInWelcomePage: React.FC<SignInWelcomePageProps> = ({
  onBack,
  onSelectPhone,
  onGoogleSignIn,
  onFacebookSignIn,
}) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col max-w-md mx-auto shadow-2xl animate-fade-in overflow-hidden z-50">
      {/* Top Hero — fresh vegetables banner */}
      <div className="relative flex-shrink-0" style={{ height: '45vh' }}>
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back"
            className="absolute top-4 left-4 z-20 p-2.5 bg-white/80 hover:bg-white text-[#181725] backdrop-blur-md rounded-full shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src="/images/Login_Image.png"
          alt="Fresh Groceries"
          className="w-full h-full object-cover object-top"
        />
        {/* Fade gradient into white content below */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content Card — fits remaining screen height */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-2 pb-8 bg-white">
        {/* Headline */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#181725] leading-snug mb-5">
            Get your groceries <br />
            <span className="text-[#53B175]">with nectar</span>
          </h2>

          {/* Phone Number Trigger Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={onSelectPhone}
            onKeyDown={(e) => e.key === 'Enter' && onSelectPhone()}
            className="flex items-center gap-3 border-b-2 border-[#E2E2E2] hover:border-[#53B175] py-3 cursor-pointer transition-colors rounded-none"
          >
            <span className="text-2xl">🇮🇳</span>
            <span className="font-bold text-[#181725] text-base">+91</span>
            <span className="text-[#7C7C7C] text-sm font-medium flex-1">
              Enter your phone number
            </span>
            <svg className="w-4 h-4 text-[#7C7C7C]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Social Options */}
        <div className="space-y-3">
          <p className="text-center text-xs font-bold text-[#7C7C7C] tracking-wide uppercase">
            Or connect with
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="w-full h-14 bg-[#5383EC] hover:bg-[#4273DF] active:scale-[0.99] text-white font-bold text-base rounded-2xl flex items-center justify-between px-5 transition-all shadow-sm"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#5383EC] text-sm flex-shrink-0">
              G
            </div>
            <span className="flex-1 text-center">Continue with Google</span>
            <div className="w-7" />
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={onFacebookSignIn}
            className="w-full h-14 bg-[#4A66AC] hover:bg-[#3B5495] active:scale-[0.99] text-white font-bold text-base rounded-2xl flex items-center justify-between px-5 transition-all shadow-sm"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#4A66AC] text-sm flex-shrink-0">
              f
            </div>
            <span className="flex-1 text-center">Continue with Facebook</span>
            <div className="w-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
