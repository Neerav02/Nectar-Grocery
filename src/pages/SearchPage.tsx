import React from 'react';
import { Search, X, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { Category, Product } from '../types';
import { INITIAL_CATEGORIES } from '../api/productsData';
import { useSearchStore } from '../stores/useSearchStore';
import { useFilterStore } from '../stores/useFilterStore';

interface SearchPageProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (category: Category) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectProduct, onSelectCategory }) => {
  const { query, setQuery, results, isLoading, error, executeSearch, resetSearch } =
    useSearchStore();

  const openFilterSheet = useFilterStore((state) => state.openFilterSheet);
  const appliedFilters = useFilterStore((state) => state.appliedFilters);

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        executeSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, executeSearch]);

  // Apply all filter criteria on results
  let filteredResults = results;
  if (appliedFilters.brands.length > 0) {
    filteredResults = filteredResults.filter((p) => appliedFilters.brands.includes(p.brand));
  }
  if (appliedFilters.categories.length > 0) {
    filteredResults = filteredResults.filter((p) =>
      appliedFilters.categories.includes(p.categoryId)
    );
  }
  if (appliedFilters.dietary.length > 0) {
    if (appliedFilters.dietary.includes('Organic Certified')) {
      filteredResults = filteredResults.filter((p) => p.nutritionInfo?.organic);
    }
  }
  if (appliedFilters.minRating > 0) {
    filteredResults = filteredResults.filter((p) => p.rating >= appliedFilters.minRating);
  }
  if (appliedFilters.priceRanges.length > 0) {
    filteredResults = filteredResults.filter((p) =>
      appliedFilters.priceRanges.some((range) => {
        if (range === 'under_2') return p.price < 2;
        if (range === '2_to_5') return p.price >= 2 && p.price <= 5;
        if (range === '5_to_10') return p.price > 5 && p.price <= 10;
        if (range === 'above_10') return p.price > 10;
        return true;
      })
    );
  }

  const hasActiveFilters =
    appliedFilters.brands.length > 0 ||
    appliedFilters.categories.length > 0 ||
    appliedFilters.priceRanges.length > 0 ||
    appliedFilters.dietary.length > 0 ||
    appliedFilters.minRating > 0;

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* ── Header Title ── */}
      <h1 className="text-2xl font-extrabold text-[#181725] text-center tracking-tight pb-3 border-b border-[#F2F3F2]">
        Find Products
      </h1>

      {/* ── Search Bar Row ── */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search store, fruits, vegetables..."
            autoFocus
            className="w-full bg-[#F2F3F2] focus:bg-white h-13 pl-12 pr-10 rounded-2xl text-sm font-bold text-[#181725] outline-none border-2 border-transparent focus:border-[#53B175] transition-all shadow-2xs"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-4" />
          {query && (
            <button
              onClick={resetSearch}
              className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-[#181725] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={openFilterSheet}
          aria-label="Filter"
          className="p-3 bg-[#F2F3F2] hover:bg-[#E5E7E5] rounded-2xl text-[#181725] transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] relative shrink-0"
        >
          <SlidersHorizontal className="w-6 h-6" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#53B175] rounded-full" />
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* ── Content View ── */}
      {!query.trim() ? (
        /* ── Category Cards Grid (Find Products) ── */
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {INITIAL_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory?.(cat)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && onSelectCategory?.(cat)}
                style={{ backgroundColor: cat.fillBg, borderColor: cat.borderColor }}
                className="group relative rounded-3xl p-5 flex flex-col items-center justify-between h-48 sm:h-56 border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] select-none"
              >
                {/* Category Image */}
                <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="max-h-28 sm:max-h-32 max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                    loading="lazy"
                  />
                </div>

                {/* Category Name */}
                <h3 className="font-extrabold text-[#181725] text-sm sm:text-base text-center leading-snug group-hover:text-[#53B175] transition-colors mt-2">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ) : filteredResults.length === 0 && !isLoading ? (
        <EmptyState
          title="No Products Found"
          description={`We couldn't find any products matching "${query}". Try another search term.`}
          actionText="Clear Search"
          onAction={resetSearch}
        />
      ) : (
        <ProductGrid
          products={filteredResults}
          isLoading={isLoading}
          onSelectProduct={onSelectProduct}
        />
      )}
    </div>
  );
};
