import React, { useState } from 'react';
import { Eye, EyeOff, Check, Sparkles, LogIn, PhoneCall } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalView, login, isAuthenticated, userProfile, logout } =
    useAuthStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'phone'>(authModalView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login' || mode === 'signup') {
      login(email || 'user@nectar.com', name || 'Demo User');
    } else if (mode === 'phone') {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      login('phone_user@nectar.com', 'Mobile User');
      setOtpSent(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isAuthenticated ? 'Account' : mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Mobile Login'}
    >
      {isAuthenticated ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#53B175]/10 text-[#53B175] flex items-center justify-center mx-auto text-2xl font-bold">
            {userProfile?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#181725]">{userProfile?.name}</h3>
            <p className="text-sm text-[#7C7C7C]">{userProfile?.email}</p>
            <p className="text-xs text-[#7C7C7C] mt-1">{userProfile?.phone}</p>
          </div>
          <PillButton variant="outline" onClick={logout}>
            Log Out
          </PillButton>
        </div>
      ) : (
        <div className="py-2">
          {/* Header Lockup */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#53B175] flex items-center justify-center text-white mb-3 shadow-xs">
              <Sparkles className="w-7 h-7 fill-white stroke-none" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#181725]">
              {mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Enter your mobile number'}
            </h3>
            <p className="text-sm text-[#7C7C7C] mt-1">
              {mode === 'login'
                ? 'Enter your email and password'
                : mode === 'signup'
                ? 'Enter your credentials to continue'
                : 'Get your groceries with Nectar'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border-b-2 border-[#E2E2E2] focus:border-[#53B175] py-2 font-semibold text-[#181725] outline-none transition-colors"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div>
                <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@email.com"
                    className="w-full font-semibold text-[#181725] outline-none pr-8 bg-transparent"
                  />
                  {email.includes('@') && email.includes('.') && (
                    <Check className="w-5 h-5 text-[#53B175] absolute right-1" />
                  )}
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div>
                <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full font-semibold text-[#181725] outline-none pr-8 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#53B175]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'phone' && (
              <div>
                {!otpSent ? (
                  <div>
                    <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2">
                      <span className="font-bold text-[#181725] mr-2">🇧🇩 +880</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="1712 345678"
                        className="w-full font-semibold text-[#181725] outline-none bg-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                      Enter 4-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="- - - -"
                      className="w-full text-center text-2xl font-bold tracking-widest border-b-2 border-[#53B175] py-3 outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-[#7C7C7C] hover:text-[#181725] font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <p className="text-xs text-[#7C7C7C] leading-snug">
                By continuing you agree to our{' '}
                <span className="text-[#53B175] font-semibold cursor-pointer underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-[#53B175] font-semibold cursor-pointer underline">
                  Privacy Policy
                </span>
                .
              </p>
            )}

            <div className="pt-2">
              <PillButton type="submit">
                {mode === 'login'
                  ? 'Log In'
                  : mode === 'signup'
                  ? 'Sign Up'
                  : !otpSent
                  ? 'Send Code'
                  : 'Verify & Log In'}
              </PillButton>
            </div>
          </form>

          {/* Social Auth buttons */}
          <div className="mt-6 pt-4 border-t border-[#F2F3F2]">
            <p className="text-center text-xs font-bold text-[#7C7C7C] mb-4 uppercase tracking-wider">
              Or connect with social media
            </p>
            <div className="space-y-3">
              <PillButton
                variant="google"
                onClick={() => login('google_user@nectar.com', 'Google User')}
                icon={<LogIn className="w-5 h-5" />}
              >
                Continue with Google
              </PillButton>

              {mode !== 'phone' && (
                <PillButton
                  variant="outline"
                  onClick={() => setMode('phone')}
                  icon={<PhoneCall className="w-5 h-5 text-[#53B175]" />}
                >
                  Continue with Phone / OTP
                </PillButton>
              )}
            </div>
          </div>

          {/* Toggle between Log In / Sign Up */}
          <div className="mt-6 text-center text-sm font-semibold">
            {mode === 'login' ? (
              <p className="text-[#181725]">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#53B175] font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-[#181725]">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#53B175] font-bold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </BottomSheet>
  );
};
