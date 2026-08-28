import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface VerificationPageProps {
  onBack: () => void;
  onSubmit: (otp: string) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ onBack, onSubmit }) => {
  const [code, setCode] = useState(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit(code.join('') || '1234');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6 max-w-md mx-auto shadow-2xl animate-fade-in">
      {/* Top Header */}
      <div>
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors mb-6 -ml-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-extrabold text-[#181725] mb-8">
          Enter your 4-digit code
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-4">
            Code
          </label>

          {/* 4 Digit Slots */}
          <div className="flex space-x-4 border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] pb-2 transition-colors">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-10 text-2xl font-extrabold text-[#181725] text-center outline-none bg-transparent"
                placeholder="-"
              />
            ))}
          </div>
        </form>
      </div>

      {/* Footer with Resend Code Link and Floating Green Arrow Button */}
      <div className="flex items-center justify-between pt-8 pb-4">
        <button
          type="button"
          onClick={() => alert('Verification code resent to your mobile number!')}
          className="text-base font-semibold text-[#53B175] hover:underline"
        >
          Resend Code
        </button>

        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-16 h-16 rounded-full bg-[#53B175] hover:bg-[#439B63] text-white flex items-center justify-center shadow-lg transition-all active:scale-95 focus-visible:ring-4 focus-visible:ring-[#53B175]/40"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
