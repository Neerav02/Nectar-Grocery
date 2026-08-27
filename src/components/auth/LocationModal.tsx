import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { userLocation, setUserLocation } = useAuthStore();

  const [zone, setZone] = useState(userLocation.zone);
  const [area, setArea] = useState(userLocation.area);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserLocation({ zone, area });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Your Location">
      <div className="flex flex-col items-center text-center py-2">
        {/* Map Pin Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-[#EEF8F2] flex items-center justify-center text-[#53B175] mb-4 shadow-xs">
          <MapPin className="w-10 h-10 stroke-[1.8]" />
        </div>

        <h3 className="text-2xl font-extrabold text-[#181725] mb-2">Select Your Location</h3>
        <p className="text-sm text-[#7C7C7C] max-w-xs mb-6">
          Switch on your location to stay in tune with what&apos;s happening in your area
        </p>

        {/* Location Selection Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
          {/* Zone Field */}
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Your Zone
            </label>
            <div className="relative border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2 flex items-center justify-between">
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-transparent font-bold text-[#181725] text-base outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="Banasree">Banasree</option>
                <option value="Gulshan">Gulshan</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Uttara">Uttara</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 pointer-events-none absolute right-1" />
            </div>
          </div>

          {/* Area Field */}
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Your Area
            </label>
            <div className="relative border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2 flex items-center justify-between">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-transparent font-bold text-[#181725] text-base outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="Block C, Dhaka">Block C, Dhaka</option>
                <option value="Block E, Dhaka">Block E, Dhaka</option>
                <option value="Sector 7, Uttara">Sector 7, Uttara</option>
                <option value="Road 11, Gulshan">Road 11, Gulshan</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 pointer-events-none absolute right-1" />
            </div>
          </div>

          <div className="pt-4">
            <PillButton type="submit">Submit</PillButton>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
};
