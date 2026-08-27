import React, { useEffect, useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Category, Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { fetchProducts } from '../api/mockApi';
import { useFilterStore } from '../stores/useFilterStore';

interface CategoryListingPageProps {
  category: Category;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoryListingPage: React.FC<CategoryListingPageProps> = ({
  category,
  onBack,
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const openFilterSheet = useFilterStore((state) => state.openFilterSheet);
  const appliedFilters = useFilterStore((state) => state.appliedFilters);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchProducts(category.id).then((res) => {
      if (isMounted) {
        let filtered = res;
        if (appliedFilters.brands.length > 0) {
          filtered = filtered.filter((p) => appliedFilters.brands.includes(p.brand));
        }
        setProducts(filtered);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category.id, appliedFilters]);

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F2F3F2]">
        <button
          onClick={onBack}
          aria-label="Back to explore"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold text-[#181725]">{category.name}</h1>

        <button
          onClick={openFilterSheet}
          aria-label="Filter products"
          className="p-2 text-[#181725] hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175] relative"
        >
          <SlidersHorizontal className="w-6 h-6" />
          {appliedFilters.brands.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#53B175] rounded-full" />
          )}
        </button>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
};
