import React from 'react';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  seeAllText?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAll,
  seeAllText = 'See all',
}) => {
  return (
    <div className="flex items-center justify-between py-3 mb-2">
      <h2 className="text-xl font-bold text-[#181725] tracking-tight">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-[#53B175] font-semibold text-sm hover:underline focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-1 transition-colors"
        >
          {seeAllText}
        </button>
      )}
    </div>
  );
};
