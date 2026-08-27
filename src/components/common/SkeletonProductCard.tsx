import React from 'react';

export const SkeletonProductCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-4 flex flex-col justify-between h-[230px] animate-pulse-subtle">
      {/* Image Skeleton */}
      <div className="bg-[#F2F3F2] rounded-xl h-28 w-full mb-3" />

      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="bg-[#F2F3F2] rounded h-4 w-3/4" />
        <div className="bg-[#F2F3F2] rounded h-3 w-1/2" />
      </div>

      {/* Footer Stepper/Price Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F2F3F2]/60">
        <div className="bg-[#F2F3F2] rounded h-5 w-16" />
        <div className="bg-[#F2F3F2] rounded-full w-10 h-10" />
      </div>
    </div>
  );
};
