import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';
import { INDIAN_LOCATION_ZONES } from '../../data/indianLocations';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { userLocation, setUserLocation } = useAuthStore();

  const [selectedZoneName, setSelectedZoneName] = useState(
    userLocation.zone || INDIAN_LOCATION_ZONES[0].name
  );

  const activeZoneObj = useMemo(() => {
    return (
      INDIAN_LOCATION_ZONES.find((z) => z.name === selectedZoneName) || INDIAN_LOCATION_ZONES[0]
    );
  }, [selectedZoneName]);

  const [selectedArea, setSelectedArea] = useState(
    userLocation.area ? userLocation.area.split(',')[0] : activeZoneObj.areas[0]
  );

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoneName = e.target.value;
    setSelectedZoneName(newZoneName);
    const newZoneObj = INDIAN_LOCATION_ZONES.find((z) => z.name === newZoneName);
    if (newZoneObj && newZoneObj.areas.length > 0) {
      setSelectedArea(newZoneObj.areas[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserLocation({
      zone: selectedZoneName,
      area: `${selectedArea}, ${selectedZoneName}`,
      city: selectedZoneName,
    });
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
              Your Zone / City
            </label>
            <div className="relative border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2 flex items-center justify-between">
              <select
                value={selectedZoneName}
                onChange={handleZoneChange}
                className="w-full bg-transparent font-bold text-[#181725] text-base outline-none cursor-pointer appearance-none pr-8"
              >
                {INDIAN_LOCATION_ZONES.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name} ({z.state})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 pointer-events-none absolute right-1" />
            </div>
          </div>

          {/* Area Field */}
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-1">
              Your Area / Locality
            </label>
            <div className="relative border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] transition-colors py-2 flex items-center justify-between">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-transparent font-bold text-[#181725] text-base outline-none cursor-pointer appearance-none pr-8"
              >
                {activeZoneObj.areas.map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
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
