import React from 'react';
import { Check } from 'lucide-react';
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
    applyFilters,
    resetFilters,
  } = useFilterStore();

  const brandOptions = [
    'Individual Collection',
    'Generic Beverage Co.',
    'Ifad',
    'Kazi Farms',
  ];

  return (
    <BottomSheet isOpen={isFilterSheetOpen} onClose={closeFilterSheet} title="Filters">
      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <h3 className="text-xl font-extrabold text-[#181725] mb-4">Categories</h3>
          <div className="space-y-3">
            {INITIAL_CATEGORIES.map((cat) => {
              const isChecked = draftFilters.categories.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  onClick={() => toggleDraftCategory(cat.id)}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                      isChecked
                        ? 'bg-[#53B175] border-[#53B175] text-white'
                        : 'border-[#E2E2E2] bg-white group-hover:border-[#53B175]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-base font-semibold transition-colors ${
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

        {/* Brand Section */}
        <div className="pt-4 border-t border-[#F2F3F2]">
          <h3 className="text-xl font-extrabold text-[#181725] mb-4">Brand</h3>
          <div className="space-y-3">
            {brandOptions.map((brand) => {
              const isChecked = draftFilters.brands.includes(brand);
              return (
                <label
                  key={brand}
                  onClick={() => toggleDraftBrand(brand)}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                      isChecked
                        ? 'bg-[#53B175] border-[#53B175] text-white'
                        : 'border-[#E2E2E2] bg-white group-hover:border-[#53B175]'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-base font-semibold transition-colors ${
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

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#F2F3F2] flex items-center space-x-3">
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
