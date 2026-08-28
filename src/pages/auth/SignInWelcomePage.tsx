import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SignInWelcomePageProps {
  onBack?: () => void;
  onSelectPhone: () => void;
  onGoogleSignIn: () => void;
  onFacebookSignIn: () => void;
  onEmailSignIn: () => void;
}

export const SignInWelcomePage: React.FC<SignInWelcomePageProps> = ({
  onBack,
  onSelectPhone,
  onGoogleSignIn,
  onFacebookSignIn,
  onEmailSignIn,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto animate-fade-in">
      {/* Centered Auth Card Container */}
      <div className="relative bg-white w-full max-w-md min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Top Hero Banner */}
        <div className="relative flex-shrink-0" style={{ height: '38vh' }}>
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="absolute top-4 left-4 z-20 p-2.5 bg-white/90 hover:bg-white text-[#181725] backdrop-blur-md rounded-full shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-[#53B175]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src="/images/Login_Image.png"
            alt="Fresh Groceries"
            className="w-full h-full object-cover object-top"
          />
          {/* Fade gradient transition into white section below */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between px-6 pt-2 pb-8 bg-white overflow-y-auto">
          {/* Headline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181725] leading-snug mb-4">
              Get your groceries <br />
              <span className="text-[#53B175]">with nectar</span>
            </h2>

            {/* Phone Trigger Row */}
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

          {/* Connect Methods */}
          <div className="space-y-3 pt-4">
            <p className="text-center text-xs font-bold text-[#7C7C7C] tracking-wider uppercase">
              Or connect with social account
            </p>

            {/* Email Login CTA */}
            <button
              type="button"
              onClick={onEmailSignIn}
              className="w-full h-13 bg-[#53B175] hover:bg-[#479b66] active:scale-[0.99] text-white font-bold text-base rounded-2xl flex items-center justify-between px-5 transition-all shadow-md"
            >
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0">
                ✉
              </div>
              <span className="flex-1 text-center">Continue with Email</span>
              <div className="w-7" />
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full h-13 bg-[#5383EC] hover:bg-[#4273DF] active:scale-[0.99] text-white font-bold text-base rounded-2xl flex items-center justify-between px-5 transition-all shadow-md"
            >
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#5383EC] text-sm shrink-0">
                G
              </div>
              <span className="flex-1 text-center">Continue with Google</span>
              <div className="w-7" />
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={onFacebookSignIn}
              className="w-full h-13 bg-[#4A66AC] hover:bg-[#3B5495] active:scale-[0.99] text-white font-bold text-base rounded-2xl flex items-center justify-between px-5 transition-all shadow-md"
            >
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#4A66AC] text-sm shrink-0">
                f
              </div>
              <span className="flex-1 text-center">Continue with Facebook</span>
              <div className="w-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
