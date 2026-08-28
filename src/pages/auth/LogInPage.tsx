import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { PillButton } from '../../components/common/PillButton';

interface LogInPageProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  onGoToSignUp: () => void;
}

export const LogInPage: React.FC<LogInPageProps> = ({ onBack, onSuccess, onGoToSignUp }) => {
  const [email, setEmail] = useState('imranhossain@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(email);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6 max-w-md mx-auto shadow-2xl animate-fade-in">
      <div>
        {/* Top Navigation */}
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors mb-4 -ml-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Top Header Lockup with Carrot Logo */}
        <div className="flex flex-col items-center text-center my-4">
          <img
            src="/images/Icon.png"
            alt="Nectar Logo"
            className="w-12 h-14 object-contain mb-6"
          />

          <h2 className="text-2xl font-extrabold text-[#181725] mb-2">Loging</h2>
          <p className="text-sm font-medium text-[#7C7C7C]">Enter your emails and password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="imranhossain@gmail.com"
              className="w-full border-b-2 border-[#E2E2E2] focus:border-[#53B175] py-2 font-bold text-[#181725] text-base outline-none bg-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full font-bold text-[#181725] text-base outline-none pr-8 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                type="button"
                className="text-xs font-semibold text-[#181725] hover:text-[#53B175]"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="pt-4">
            <PillButton type="submit">Log In</PillButton>
          </div>
        </form>
      </div>

      {/* Switch to Sign Up */}
      <div className="text-center py-4">
        <p className="text-sm font-semibold text-[#181725]">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onGoToSignUp}
            className="text-[#53B175] font-extrabold hover:underline"
          >
            Sing up
          </button>
        </p>
      </div>
    </div>
  );
};
