import React from 'react';
import { PillButton } from './PillButton';
import { ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px] animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-[#EEF8F2] flex items-center justify-center mb-6 text-[#53B175]">
        {icon || <ShoppingBag className="w-12 h-12 stroke-[1.5]" />}
      </div>
      <h3 className="text-2xl font-bold text-[#181725] mb-2">{title}</h3>
      <p className="text-[#7C7C7C] text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="w-full max-w-xs">
          <PillButton onClick={onAction}>{actionText}</PillButton>
        </div>
      )}
    </div>
  );
};
