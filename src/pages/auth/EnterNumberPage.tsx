import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface EnterNumberPageProps {
  onBack: () => void;
  onSubmit: (phone: string) => void;
}

export const EnterNumberPage: React.FC<EnterNumberPageProps> = ({ onBack, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(`+880${phoneNumber || '1712345678'}`);
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
          Enter your mobile number
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-2">
            Mobile Number
          </label>

          <div className="flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors">
            <span className="text-xl mr-2">🇧🇩</span>
            <span className="font-bold text-[#181725] text-base mr-3">+880</span>
            <input
              type="tel"
              required
              autoFocus
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1712 345678"
              className="w-full text-lg font-bold text-[#181725] outline-none bg-transparent"
            />
          </div>
        </form>
      </div>

      {/* Floating Bottom-Right Green Circle Submit Button */}
      <div className="flex justify-end pt-8 pb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-16 h-16 rounded-full bg-[#53B175] hover:bg-[#439B63] text-white flex items-center justify-center shadow-lg transition-all active:scale-95 focus-visible:ring-4 focus-visible:ring-[#53B175]/40"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
