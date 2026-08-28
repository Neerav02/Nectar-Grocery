import React, { useState } from 'react';
import { Eye, EyeOff, Check, PhoneCall } from 'lucide-react';
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
      closeAuthModal();
    } else if (mode === 'phone') {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      login('phone_user@nectar.com', 'Mobile User');
      setOtpSent(false);
      closeAuthModal();
    }
  };

  const modalTitle =
    isAuthenticated
      ? 'My Account'
      : mode === 'login'
      ? 'Log In'
      : mode === 'signup'
      ? 'Sign Up'
      : 'Phone Login';

  return (
    <BottomSheet isOpen={isAuthModalOpen} onClose={closeAuthModal} title={modalTitle}>
      {isAuthenticated ? (
        /* ── Authenticated: Account panel ── */
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#53B175]/10 text-[#53B175] flex items-center justify-center text-2xl font-extrabold">
            {userProfile?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#181725]">{userProfile?.name}</p>
            <p className="text-sm text-[#7C7C7C]">{userProfile?.email}</p>
          </div>
          <PillButton variant="outline" onClick={logout}>
            Log Out
          </PillButton>
        </div>
      ) : (
        /* ── Unauthenticated: Compact single-card form ── */
        <div className="flex flex-col gap-4">

          {/* Subtitle only — no duplicate logo or title since BottomSheet header already shows mode */}
          <p className="text-sm text-[#7C7C7C] text-center -mt-1">
            {mode === 'login'
              ? 'Enter your email and password'
              : mode === 'signup'
              ? 'Enter your credentials to continue'
              : otpSent
              ? 'Enter the 4-digit code we sent'
              : 'Enter your mobile number'}
          </p>

          {/* ── Form Fields ── */}
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
            {/* Username — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border-b-2 border-[#E2E2E2] focus:border-[#53B175] py-1.5 font-semibold text-[#181725] outline-none transition-colors bg-transparent text-sm"
                />
              </div>
            )}

            {/* Email */}
            {(mode === 'login' || mode === 'signup') && (
              <div>
                <label className="block text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@email.com"
                    className="w-full font-semibold text-[#181725] outline-none pr-7 bg-transparent text-sm"
                  />
                  {email.includes('@') && email.includes('.') && (
                    <Check className="w-4 h-4 text-[#53B175] absolute right-1 shrink-0" />
                  )}
                </div>
              </div>
            )}

            {/* Password */}
            {(mode === 'login' || mode === 'signup') && (
              <div>
                <label className="block text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full font-semibold text-[#181725] outline-none pr-7 bg-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <div className="text-right mt-1">
                    <button type="button" className="text-[11px] text-[#7C7C7C] hover:text-[#181725] font-semibold">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Phone / OTP */}
            {mode === 'phone' && (
              <div>
                {!otpSent ? (
                  <>
                    <label className="block text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-1.5 gap-2">
                      <span className="font-bold text-[#181725] text-sm shrink-0">🇮🇳 +91</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="flex-1 font-semibold text-[#181725] outline-none bg-transparent text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="- - - -"
                      className="w-full text-center text-2xl font-bold tracking-widest border-b-2 border-[#53B175] py-2 outline-none bg-transparent"
                    />
                  </>
                )}
              </div>
            )}

            {/* Terms — signup only */}
            {mode === 'signup' && (
              <p className="text-[11px] text-[#7C7C7C] leading-snug">
                By continuing you agree to our{' '}
                <span className="text-[#53B175] font-semibold cursor-pointer underline">Terms of Service</span>{' '}
                and{' '}
                <span className="text-[#53B175] font-semibold cursor-pointer underline">Privacy Policy</span>.
              </p>
            )}

            {/* Primary CTA */}
            <PillButton type="submit">
              {mode === 'login'
                ? 'Log In'
                : mode === 'signup'
                ? 'Sign Up'
                : !otpSent
                ? 'Send Code'
                : 'Verify & Log In'}
            </PillButton>
          </form>

          {/* Social Auth — compact */}
          <div className="border-t border-[#F2F3F2] pt-3 flex flex-col gap-2">
            <p className="text-center text-[11px] font-bold text-[#7C7C7C] uppercase tracking-wider">
              Or connect with social media
            </p>

            <button
              type="button"
              onClick={() => { login('google_user@nectar.com', 'Google User'); closeAuthModal(); }}
              className="w-full h-11 bg-[#5383EC] hover:bg-[#4273DF] text-white font-bold text-sm rounded-2xl flex items-center justify-between px-4 transition-all"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-[#5383EC] text-xs shrink-0">G</div>
              <span className="flex-1 text-center">Continue with Google</span>
              <div className="w-6" />
            </button>

            {mode !== 'phone' && (
              <button
                type="button"
                onClick={() => setMode('phone')}
                className="w-full h-11 border-2 border-[#E2E2E2] hover:border-[#53B175] text-[#181725] font-bold text-sm rounded-2xl flex items-center justify-between px-4 transition-all"
              >
                <PhoneCall className="w-5 h-5 text-[#53B175] shrink-0" />
                <span className="flex-1 text-center">Continue with Phone / OTP</span>
                <div className="w-5" />
              </button>
            )}
          </div>

          {/* Toggle login ↔ signup */}
          <p className="text-center text-xs font-semibold text-[#181725] pb-1">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-[#53B175] font-bold hover:underline">
                  Sign up
                </button>
              </>
            ) : mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-[#53B175] font-bold hover:underline">
                  Log in
                </button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="text-[#7C7C7C] hover:text-[#181725]">
                ← Back to Log In
              </button>
            )}
          </p>
        </div>
      )}
    </BottomSheet>
  );
};
