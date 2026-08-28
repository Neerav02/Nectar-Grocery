import React from 'react';
import { Search, X, SlidersHorizontal, AlertCircle, FilterX } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { Category, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../api/productsData';
import { useSearchStore } from '../stores/useSearchStore';
import { useFilterStore } from '../stores/useFilterStore';

interface SearchPageProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (category: Category) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectProduct, onSelectCategory }) => {
  const { query, setQuery, results, isLoading, error, executeSearch, resetSearch } =
    useSearchStore();

  const {
    openFilterSheet,
    appliedFilters,
    toggleDraftCategory,
    toggleDraftBrand,
    toggleDraftPriceRange,
    toggleDraftDietary,
    setDraftMinRating,
    applyFilters,
    resetFilters,
  } = useFilterStore();

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        executeSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, executeSearch]);

  const hasActiveFilters =
    appliedFilters.brands.length > 0 ||
    appliedFilters.categories.length > 0 ||
    appliedFilters.priceRanges.length > 0 ||
    appliedFilters.dietary.length > 0 ||
    appliedFilters.minRating > 0;

  // Base list of products: if query is set use API results; if query is empty use catalog products
  const baseProducts = query.trim() ? results : INITIAL_PRODUCTS;

  // Apply all filter criteria on baseProducts
  let filteredResults = baseProducts;

  if (appliedFilters.categories.length > 0) {
    filteredResults = filteredResults.filter((p) =>
      appliedFilters.categories.includes(p.categoryId)
    );
  }

  if (appliedFilters.brands.length > 0) {
    filteredResults = filteredResults.filter((p) => appliedFilters.brands.includes(p.brand));
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

  const showFilteredProductsView = query.trim().length > 0 || hasActiveFilters;

  // Helper functions to remove individual filters
  const removeCategoryFilter = (catId: string) => {
    toggleDraftCategory(catId);
    applyFilters();
  };

  const removeBrandFilter = (brandName: string) => {
    toggleDraftBrand(brandName);
    applyFilters();
  };

  const removePriceFilter = (rangeKey: string) => {
    toggleDraftPriceRange(rangeKey);
    applyFilters();
  };

  const removeDietaryFilter = (item: string) => {
    toggleDraftDietary(item);
    applyFilters();
  };

  const removeRatingFilter = () => {
    setDraftMinRating(0);
    applyFilters();
  };

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

      {/* ── Active Filter Badges Bar ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#EEF8F2]/60 border border-[#53B175]/30 rounded-2xl">
          <span className="text-xs font-extrabold text-[#53B175] uppercase tracking-wider mr-1">
            Active Filters:
          </span>

          {appliedFilters.categories.map((catId) => {
            const catObj = INITIAL_CATEGORIES.find((c) => c.id === catId);
            return (
              <span
                key={catId}
                className="inline-flex items-center space-x-1.5 bg-[#53B175] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
              >
                <span>{catObj?.name || catId}</span>
                <button onClick={() => removeCategoryFilter(catId)} aria-label="Remove category">
                  <X className="w-3.5 h-3.5 stroke-[3] hover:opacity-80" />
                </button>
              </span>
            );
          })}

          {appliedFilters.priceRanges.map((rangeKey) => (
            <span
              key={rangeKey}
              className="inline-flex items-center space-x-1.5 bg-[#53B175] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
            >
              <span>
                {rangeKey === 'under_2'
                  ? 'Under $2'
                  : rangeKey === '2_to_5'
                  ? '$2 - $5'
                  : rangeKey === '5_to_10'
                  ? '$5 - $10'
                  : '$10+'}
              </span>
              <button onClick={() => removePriceFilter(rangeKey)} aria-label="Remove price filter">
                <X className="w-3.5 h-3.5 stroke-[3] hover:opacity-80" />
              </button>
            </span>
          ))}

          {appliedFilters.dietary.map((item) => (
            <span
              key={item}
              className="inline-flex items-center space-x-1.5 bg-[#53B175] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
            >
              <span>{item}</span>
              <button onClick={() => removeDietaryFilter(item)} aria-label="Remove dietary filter">
                <X className="w-3.5 h-3.5 stroke-[3] hover:opacity-80" />
              </button>
            </span>
          ))}

          {appliedFilters.minRating > 0 && (
            <span className="inline-flex items-center space-x-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xs">
              <span>{appliedFilters.minRating}★ & above</span>
              <button onClick={removeRatingFilter} aria-label="Remove rating filter">
                <X className="w-3.5 h-3.5 stroke-[3] hover:opacity-80" />
              </button>
            </span>
          )}

          {appliedFilters.brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center space-x-1.5 bg-[#53B175] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
            >
              <span>{brand}</span>
              <button onClick={() => removeBrandFilter(brand)} aria-label="Remove brand filter">
                <X className="w-3.5 h-3.5 stroke-[3] hover:opacity-80" />
              </button>
            </span>
          ))}

          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 text-xs font-extrabold text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-xl transition-colors ml-auto"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* ── Content View ── */}
      {showFilteredProductsView ? (
        filteredResults.length === 0 && !isLoading ? (
          <EmptyState
            title="No Matching Products"
            description="We couldn't find any products matching your selected filters. Try clearing some filters."
            actionText="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#181725]">
                {query.trim()
                  ? `Search Results for "${query}"`
                  : `Filtered Products (${filteredResults.length})`}
              </h2>
            </div>
            <ProductGrid
              products={filteredResults}
              isLoading={isLoading}
              onSelectProduct={onSelectProduct}
            />
          </div>
        )
      ) : (
        /* ── Default Category Cards Grid (Find Products) ── */
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
      )}
    </div>
  );
};
