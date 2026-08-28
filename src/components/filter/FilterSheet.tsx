import React from 'react';
import { Check, Star, Tag, ShieldCheck, DollarSign, Layers } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useFilterStore } from '../../stores/useFilterStore';
import { INITIAL_CATEGORIES } from '../../api/productsData';

export const FilterSheet: React.FC = () => {
  const {
    isFilterSheetOpen,
    closeFilterSheet,
    draftFilters,
    toggleDraftCategory,
    toggleDraftBrand,
    toggleDraftPriceRange,
    toggleDraftDietary,
    setDraftMinRating,
    applyFilters,
    resetFilters,
  } = useFilterStore();

  const brandOptions = [
    'Nectar Fresh',
    'Organic India',
    'Kazi Farms',
    'Ifad',
    'Generic Beverage Co.',
    'Individual Collection',
    'Amul',
    'Nestle',
    'Fortune',
  ];

  const priceRangeOptions = [
    { key: 'under_2', label: 'Under $2.00' },
    { key: '2_to_5', label: '$2.00 - $5.00' },
    { key: '5_to_10', label: '$5.00 - $10.00' },
    { key: 'above_10', label: '$10.00+' },
  ];

  const dietaryOptions = [
    'Organic Certified',
    'Gluten Free',
    'Vegan Friendly',
    '100% Natural',
  ];

  const ratingOptions = [
    { stars: 4.5, label: '4.5 ★ & above' },
    { stars: 4.0, label: '4.0 ★ & above' },
    { stars: 3.5, label: '3.5 ★ & above' },
  ];

  return (
    <BottomSheet isOpen={isFilterSheetOpen} onClose={closeFilterSheet} title="Filter Products">
      <div className="flex flex-col h-full max-h-[75vh]">
        {/* ── Scrollable Body for all filter options ── */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4 scrollbar-thin">
          
          {/* Section 1: Categories */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Layers className="w-5 h-5 text-[#53B175]" />
              <h3 className="text-lg font-extrabold text-[#181725]">Categories</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INITIAL_CATEGORIES.map((cat) => {
                const isChecked = draftFilters.categories.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    onClick={() => toggleDraftCategory(cat.id)}
                    className={`flex items-center space-x-3 p-2.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#EEF8F2] border-[#53B175] shadow-2xs'
                        : 'border-[#E2E2E2] bg-white hover:border-[#53B175]/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                        isChecked
                          ? 'bg-[#53B175] border-[#53B175] text-white'
                          : 'border-[#E2E2E2] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isChecked ? 'text-[#53B175]' : 'text-[#181725]'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Price Range */}
          <div className="pt-4 border-t border-[#F2F3F2]">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-[#53B175]" />
              <h3 className="text-lg font-extrabold text-[#181725]">Price Range</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {priceRangeOptions.map((opt) => {
                const isSelected = draftFilters.priceRanges.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleDraftPriceRange(opt.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#53B175] text-white border-[#53B175] shadow-xs'
                        : 'bg-[#F2F3F2] text-[#181725] border-transparent hover:bg-[#E5E7E5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Dietary & Preferences */}
          <div className="pt-4 border-t border-[#F2F3F2]">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#53B175]" />
              <h3 className="text-lg font-extrabold text-[#181725]">Dietary & Quality</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((item) => {
                const isSelected = draftFilters.dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDraftDietary(item)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#EEF8F2] text-[#53B175] border-[#53B175]'
                        : 'bg-white text-[#7C7C7C] border-[#E2E2E2] hover:border-gray-400'
                    }`}
                  >
                    {isSelected ? `✓ ${item}` : item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Rating */}
          <div className="pt-4 border-t border-[#F2F3F2]">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-extrabold text-[#181725]">Minimum Rating</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((r) => {
                const isSelected = draftFilters.minRating === r.stars;
                return (
                  <button
                    key={r.stars}
                    type="button"
                    onClick={() => setDraftMinRating(r.stars)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-[#F8F9FA] text-[#181725] border-[#E2E2E2] hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Brands */}
          <div className="pt-4 border-t border-[#F2F3F2]">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-5 h-5 text-[#53B175]" />
              <h3 className="text-lg font-extrabold text-[#181725]">Brand</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {brandOptions.map((brand) => {
                const isChecked = draftFilters.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    onClick={() => toggleDraftBrand(brand)}
                    className="flex items-center space-x-3 p-2 rounded-xl cursor-pointer group select-none hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                        isChecked
                          ? 'bg-[#53B175] border-[#53B175] text-white'
                          : 'border-[#E2E2E2] bg-white group-hover:border-[#53B175]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isChecked ? 'text-[#53B175]' : 'text-[#181725]'
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Footer Bar (Never Clipped!) ── */}
        <div className="pt-4 mt-2 border-t border-[#F2F3F2] flex items-center space-x-3 shrink-0 bg-white z-10">
          <PillButton variant="outline" onClick={resetFilters} fullWidth={false} className="w-1/3">
            Reset
          </PillButton>
          <PillButton onClick={applyFilters} className="w-2/3">
            Apply Filter
          </PillButton>
        </div>
      </div>
    </BottomSheet>
  );
};
