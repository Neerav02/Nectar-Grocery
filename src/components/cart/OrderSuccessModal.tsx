import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check } from 'lucide-react';
import { PillButton } from '../common/PillButton';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#53B175', '#4FC28C', '#F3A747', '#7FB8DE'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full text-center flex flex-col items-center p-6">
        {/* Success Icon Lockup with Confetti SVG Shapes */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-[#53B175] flex items-center justify-center text-white shadow-xl animate-bounce">
            <Check className="w-16 h-16 stroke-[3]" />
          </div>
          {/* Decorative squiggles/dots around icon */}
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-amber-400 opacity-80" />
          <div className="absolute top-10 -right-4 w-3 h-3 rounded-full bg-blue-400 opacity-80" />
          <div className="absolute -bottom-2 right-4 w-5 h-5 rounded-full bg-purple-400 opacity-80" />
        </div>

        {/* Headlines */}
        <h2 className="text-3xl font-extrabold text-[#181725] mb-3 leading-tight">
          Your Order has been accepted
        </h2>
        <p className="text-[#7C7C7C] text-base leading-relaxed mb-8 max-w-xs">
          Your order has been placed and is on its way to being processed.
        </p>

        {/* Actions */}
        <div className="w-full space-y-4">
          <PillButton onClick={onTrackOrder}>Track Order</PillButton>
          <button
            type="button"
            onClick={onClose}
            className="text-base font-bold text-[#181725] hover:text-[#53B175] transition-colors py-2 block w-full"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};
