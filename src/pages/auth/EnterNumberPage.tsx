import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { flag: '🇮🇳', code: '+91',  name: 'India' },
  { flag: '🇺🇸', code: '+1',   name: 'United States' },
  { flag: '🇬🇧', code: '+44',  name: 'United Kingdom' },
  { flag: '🇦🇺', code: '+61',  name: 'Australia' },
  { flag: '🇨🇦', code: '+1',   name: 'Canada' },
  { flag: '🇧🇩', code: '+880', name: 'Bangladesh' },
  { flag: '🇵🇰', code: '+92',  name: 'Pakistan' },
  { flag: '🇸🇬', code: '+65',  name: 'Singapore' },
  { flag: '🇦🇪', code: '+971', name: 'UAE' },
  { flag: '🇸🇦', code: '+966', name: 'Saudi Arabia' },
  { flag: '🇩🇪', code: '+49',  name: 'Germany' },
  { flag: '🇫🇷', code: '+33',  name: 'France' },
  { flag: '🇯🇵', code: '+81',  name: 'Japan' },
  { flag: '🇨🇳', code: '+86',  name: 'China' },
  { flag: '🇧🇷', code: '+55',  name: 'Brazil' },
  { flag: '🇿🇦', code: '+27',  name: 'South Africa' },
  { flag: '🇳🇬', code: '+234', name: 'Nigeria' },
  { flag: '🇰🇪', code: '+254', name: 'Kenya' },
];

interface EnterNumberPageProps {
  onBack: () => void;
  onSubmit: (phone: string) => void;
}

export const EnterNumberPage: React.FC<EnterNumberPageProps> = ({ onBack, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // India by default
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phoneNumber.trim()) return;
    onSubmit(`${selectedCountry.code}${phoneNumber}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl animate-fade-in">
      {/* Top Header */}
      <div className="flex-1 p-6 flex flex-col">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors mb-6 -ml-2 w-fit"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-extrabold text-[#181725] mb-1">
          Enter your mobile number
        </h2>
        <p className="text-sm text-[#7C7C7C] mb-8">
          We'll send you a verification code
        </p>

        <form onSubmit={handleSubmit} className="flex-1">
          <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-2">
            Mobile Number
          </label>

          {/* Country + Phone Row */}
          <div className="flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors gap-2 relative">
            {/* Country Selector */}
            <div ref={dropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => { setIsDropdownOpen(!isDropdownOpen); setSearch(''); }}
                className="flex items-center gap-1.5 hover:bg-gray-50 rounded-lg px-1 py-0.5 transition-colors"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="font-bold text-[#181725] text-base">{selectedCountry.code}</span>
                <ChevronDown className="w-4 h-4 text-[#7C7C7C]" />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#F2F3F2] z-50 overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-3 border-b border-[#F2F3F2]">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search country..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-[#F2F3F2] rounded-xl px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <ul className="max-h-52 overflow-y-auto divide-y divide-[#F2F3F2]">
                    {filteredCountries.map((c) => (
                      <li key={`${c.name}-${c.code}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                            setSearch('');
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#F2F3F2] transition-colors text-left ${
                            selectedCountry.name === c.name ? 'bg-[#53B175]/10 font-bold text-[#53B175]' : 'text-[#181725]'
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="flex-1">{c.name}</span>
                          <span className="text-[#7C7C7C] font-semibold">{c.code}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="w-px h-5 bg-[#E2E2E2]" />

            {/* Phone Input */}
            <input
              type="tel"
              required
              autoFocus={!isDropdownOpen}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your number"
              className="flex-1 text-lg font-bold text-[#181725] outline-none bg-transparent"
            />
          </div>

          <p className="text-xs text-[#7C7C7C] mt-3">
            Standard SMS rates may apply
          </p>
        </form>
      </div>

      {/* Floating Green Circle Submit Button */}
      <div className="flex justify-end px-6 pb-10">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!phoneNumber.trim()}
          className="w-16 h-16 rounded-full bg-[#53B175] hover:bg-[#439B63] disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg transition-all active:scale-95 focus-visible:ring-4 focus-visible:ring-[#53B175]/40"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
