import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronDown, MapPin } from 'lucide-react';
import { PillButton } from '../../components/common/PillButton';
import { useAuthStore } from '../../stores/useAuthStore';
import { INDIAN_LOCATION_ZONES } from '../../data/indianLocations';

interface SelectLocationPageProps {
  onBack: () => void;
  onSubmit: () => void;
}

export const SelectLocationPage: React.FC<SelectLocationPageProps> = ({ onBack, onSubmit }) => {
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
    userLocation.area || activeZoneObj.areas[0]
  );

  // When Zone changes, update default Area to first area in the zone
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
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6 max-w-md mx-auto shadow-2xl animate-fade-in">
      <div>
        {/* Top Header */}
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors mb-4 -ml-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Map Illustration Header */}
        <div className="flex flex-col items-center text-center my-6">
          <div className="w-32 h-32 bg-[#EEF8F2] rounded-full flex items-center justify-center mb-6 relative">
            <div className="w-20 h-20 bg-blue-100/60 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#53B175] stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-[#181725] mb-2">
            Select Your Location
          </h2>
          <p className="text-sm font-medium text-[#7C7C7C] max-w-xs leading-relaxed">
            Switch on your location to stay in tune with what&apos;s happening in your area
          </p>
        </div>

        {/* Location Dropdowns Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Zone Dropdown */}
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-2">
              Your Zone / City
            </label>
            <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors">
              <select
                value={selectedZoneName}
                onChange={handleZoneChange}
                className="w-full font-bold text-[#181725] text-base outline-none bg-transparent appearance-none cursor-pointer pr-8"
              >
                {INDIAN_LOCATION_ZONES.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name} ({z.state})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-1 pointer-events-none" />
            </div>
          </div>

          {/* Area Dropdown */}
          <div>
            <label className="block text-xs font-bold text-[#7C7C7C] uppercase tracking-wider mb-2">
              Your Area / Locality
            </label>
            <div className="relative flex items-center border-b-2 border-[#E2E2E2] focus-within:border-[#53B175] py-2 transition-colors">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full font-bold text-[#181725] text-base outline-none bg-transparent appearance-none cursor-pointer pr-8"
              >
                {activeZoneObj.areas.map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-1 pointer-events-none" />
            </div>
          </div>

          <div className="pt-8">
            <PillButton type="submit">Submit</PillButton>
          </div>
        </form>
      </div>
    </div>
  );
};
