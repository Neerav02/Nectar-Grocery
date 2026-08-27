import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';

interface OrderFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const OrderFailureModal: React.FC<OrderFailureModalProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center py-4">
        {/* Grocery Bag Illustration Backdrop */}
        <div className="w-24 h-24 rounded-full bg-[#FDE8E4] flex items-center justify-center text-red-500 mb-6 shadow-xs">
          <ShoppingBag className="w-12 h-12 stroke-[1.8]" />
        </div>

        {/* Headlines */}
        <h2 className="text-3xl font-extrabold text-[#181725] mb-2">Oops! Order Failed</h2>
        <p className="text-[#7C7C7C] text-base mb-8">Something went terribly wrong.</p>

        {/* Actions */}
        <div className="w-full space-y-4">
          <PillButton onClick={onRetry}>Please Try Again</PillButton>
          <button
            type="button"
            onClick={onClose}
            className="text-base font-bold text-[#181725] hover:text-[#53B175] transition-colors py-2 block w-full"
          >
            Back to home
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
