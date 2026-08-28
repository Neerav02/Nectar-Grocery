import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`bg-emerald-50 text-[#53B175] flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 ${className}`}
      >
        <ShoppingBag className="w-10 h-10 opacity-70 mb-1" />
        <span className="text-[10px] font-semibold text-[#7C7C7C] text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      className={className}
    />
  );
};
