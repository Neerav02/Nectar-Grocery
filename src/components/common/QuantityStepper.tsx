import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={clsx(
          'flex items-center justify-center rounded-2xl transition-colors border border-[#E2E2E2] focus-visible:ring-2 focus-visible:ring-[#53B175] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed',
          isSm ? 'w-8 h-8 text-gray-500 hover:text-[#53B175]' : 'w-11 h-11 text-gray-500 hover:border-[#53B175] hover:text-[#53B175]'
        )}
      >
        <Minus className={isSm ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      </button>

      <span
        className={clsx(
          'font-semibold text-[#181725] text-center min-w-[24px]',
          isSm ? 'text-base' : 'text-lg border border-[#E2E2E2] rounded-xl px-4 py-1.5'
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={clsx(
          'flex items-center justify-center rounded-2xl transition-colors border border-[#E2E2E2] focus-visible:ring-2 focus-visible:ring-[#53B175] active:scale-95 text-[#53B175] hover:border-[#53B175] hover:bg-[#53B175]/10 disabled:opacity-30 disabled:cursor-not-allowed',
          isSm ? 'w-8 h-8' : 'w-11 h-11'
        )}
      >
        <Plus className={isSm ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      </button>
    </div>
  );
};
