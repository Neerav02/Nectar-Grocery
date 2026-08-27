import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { SkeletonProductCard } from '../common/SkeletonProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onSelectProduct?: (product: Product) => void;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onSelectProduct,
  skeletonCount = 6,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelectProduct?.(product)}
        />
      ))}
    </div>
  );
};
