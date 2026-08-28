import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { PillButton } from '../../components/common/PillButton';

interface SignUpPageProps {
  onBack: () => void;
  onSuccess: (name: string, email: string) => void;
  onGoToLogIn: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onBack, onSuccess, onGoToLogIn }) => {
  const [name, setName] = useState('Afsar Hossain Shuvo');
  const [email, setEmail] = useState('imranhossain@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(name, email);
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

        {/* Header with Carrot Logo */}
        <div className="flex flex-col items-center text-center my-4">
          {/* White background — use ICON_1.png */}
          <img src="/images/ICON_1.png" alt="Nectar Logo" className="w-12 h-14 object-contain mb-6" />

          <h2 className="text-2xl font-extrabold text-[#181725] mb-2">Sign Up</h2>
          <p className="text-sm font-medium text-[#7C7C7C]">Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Afsar Hossain Shuvo"
              className="w-full border-b-2 border-[#E2E2E2] focus:border-[#53B175] py-2 font-bold text-[#181725] text-base outline-none bg-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="imranhossain@gmail.com"
                className="w-full font-bold text-[#181725] text-base outline-none pr-8 bg-transparent"
              />
              {email.includes('@') && email.includes('.') && (
                <Check className="w-5 h-5 text-[#53B175] absolute right-1 stroke-[3]" />
              )}
            </div>
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
          </div>

          <p className="text-xs font-medium text-[#7C7C7C] leading-snug">
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

          <div className="pt-2">
            <PillButton type="submit">Sing up</PillButton>
          </div>
        </form>
      </div>

      {/* Switch to Log In */}
      <div className="text-center py-4">
        <p className="text-sm font-semibold text-[#181725]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoToLogIn}
            className="text-[#53B175] font-extrabold hover:underline"
          >
            Loging
          </button>
        </p>
      </div>
    </div>
  );
};
