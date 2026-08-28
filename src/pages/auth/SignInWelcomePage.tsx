import React from 'react';

interface SignInWelcomePageProps {
  onSelectPhone: () => void;
  onGoogleSignIn: () => void;
  onFacebookSignIn: () => void;
}

export const SignInWelcomePage: React.FC<SignInWelcomePageProps> = ({
  onSelectPhone,
  onGoogleSignIn,
  onFacebookSignIn,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto shadow-2xl overflow-hidden animate-fade-in">
      {/* Top Hero Section with Fresh Vegetables Illustration */}
      <div className="relative h-64 w-full bg-slate-50 overflow-hidden">
        <img
          src="/images/signin_bg.png"
          alt="Fresh Groceries"
          className="w-full h-full object-cover object-top filter drop-shadow-sm"
        />
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between -mt-6 bg-white rounded-t-3xl z-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181725] leading-tight mb-6">
            Get your groceries <br /> with nectar
          </h2>

          {/* Mobile Number Input Trigger */}
          <div
            onClick={onSelectPhone}
            className="flex items-center space-x-3 border-b-2 border-[#E2E2E2] hover:border-[#53B175] py-3 cursor-pointer transition-colors"
          >
            <span className="text-xl">🇧🇩</span>
            <span className="font-bold text-[#181725] text-base">+880</span>
            <span className="text-[#7C7C7C] text-sm font-medium ml-2">Enter phone number</span>
          </div>
        </div>

        {/* Social Connection Options */}
        <div className="space-y-4 my-8">
          <p className="text-center text-xs font-bold text-[#7C7C7C] tracking-wide">
            Or connect with social media
          </p>

          <button
            type="button"
            onClick={onGoogleSignIn}
            className="w-full h-14 bg-[#5383EC] hover:bg-[#4273DF] text-white font-semibold text-base rounded-2xl flex items-center justify-between px-6 transition-all shadow-sm active:scale-[0.99]"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#5383EC] text-base">
              G
            </div>
            <span className="flex-1 text-center font-bold">Continue with Google</span>
            <div className="w-7" />
          </button>

          <button
            type="button"
            onClick={onFacebookSignIn}
            className="w-full h-14 bg-[#4A66AC] hover:bg-[#3B5495] text-white font-semibold text-base rounded-2xl flex items-center justify-between px-6 transition-all shadow-sm active:scale-[0.99]"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-black text-[#4A66AC] text-base">
              f
            </div>
            <span className="flex-1 text-center font-bold">Continue with Facebook</span>
            <div className="w-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
