import React from 'react';
import { Search } from 'lucide-react';
import { Category } from '../types';
import { INITIAL_CATEGORIES } from '../api/productsData';

interface ExplorePageProps {
  onSelectCategory: (category: Category) => void;
  onOpenSearch: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectCategory, onOpenSearch }) => {
  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Title */}
      <h1 className="text-2xl font-extrabold text-[#181725] text-center tracking-tight">
        Find Products
      </h1>

      {/* Search Input Bar */}
      <div className="relative">
        <div
          onClick={onOpenSearch}
          className="w-full bg-[#F2F3F2] hover:bg-[#E5E7E5] h-13 pl-12 pr-4 rounded-2xl flex items-center text-sm text-[#7C7C7C] font-medium cursor-pointer transition-colors"
        >
          <Search className="w-5 h-5 text-gray-500 absolute left-4" />
          <span>Search Store</span>
        </div>
      </div>

      {/* 2-Column Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {INITIAL_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && onSelectCategory(cat)}
            style={{ backgroundColor: cat.fillBg, borderColor: cat.borderColor }}
            className="flex flex-col items-center justify-between p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] h-48 select-none"
          >
            {/* Category Food Image Cluster */}
            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Category Label */}
            <span className="font-bold text-[#181725] text-base text-center leading-tight line-clamp-2 mt-2">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
