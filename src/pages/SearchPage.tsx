import React, { useEffect } from 'react';
import { Search, X, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { StaleSearchDebugPanel } from '../components/search/StaleSearchDebugPanel';
import { EmptyState } from '../components/common/EmptyState';
import { Product } from '../types';
import { useSearchStore } from '../stores/useSearchStore';
import { useFilterStore } from '../stores/useFilterStore';

interface SearchPageProps {
  onSelectProduct: (product: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectProduct }) => {
  const { query, setQuery, results, isLoading, error, executeSearch, resetSearch } =
    useSearchStore();

  const openFilterSheet = useFilterStore((state) => state.openFilterSheet);
  const appliedFilters = useFilterStore((state) => state.appliedFilters);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        executeSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, executeSearch]);

  // Apply local brand/category filter on results
  let filteredResults = results;
  if (appliedFilters.brands.length > 0) {
    filteredResults = filteredResults.filter((p) => appliedFilters.brands.includes(p.brand));
  }
  if (appliedFilters.categories.length > 0) {
    filteredResults = filteredResults.filter((p) =>
      appliedFilters.categories.includes(p.categoryId)
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Search Header Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search store, eggs, milk, cola..."
            autoFocus
            className="w-full bg-[#F2F3F2] focus:bg-white h-13 pl-12 pr-10 rounded-2xl text-sm font-bold text-[#181725] outline-none border-2 border-transparent focus:border-[#53B175] transition-all"
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
          {(appliedFilters.brands.length > 0 || appliedFilters.categories.length > 0) && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#53B175] rounded-full" />
          )}
        </button>
      </div>

      {/* Interactive Challenge A Debug Mode Panel */}
      <StaleSearchDebugPanel />

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Results grid */}
      {!query.trim() ? (
        <EmptyState
          title="Search Nectar Store"
          description="Type 'egg', 'milk', 'cola', or 'apple' above to test search results and stale request protection."
        />
      ) : filteredResults.length === 0 && !isLoading ? (
        <EmptyState
          title="No Products Found"
          description={`We couldn't find any products matching "${query}". Try searching for another item or clearing your filters.`}
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
