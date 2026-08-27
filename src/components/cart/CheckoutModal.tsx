import React, { useState } from 'react';
import { ChevronRight, CreditCard, Tag, Truck } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useCartStore } from '../../stores/useCartStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 2.0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onClose();

      if (simulateFailure) {
        onFailure();
      } else {
        clearCart();
        onSuccess();
      }
    }, 1200);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Checkout">
      <div className="space-y-4 py-2">
        {/* Checkout Summary Rows */}
        <div className="divide-y divide-[#F2F3F2] border-y border-[#F2F3F2]">
          {/* Delivery Row */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl">
            <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-base">
              <Truck className="w-5 h-5 text-gray-500" />
              <span className="text-[#181725]">Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold text-[#181725]">
              <span>Select Method ($2.00)</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Payment Row */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl">
            <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-base">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span className="text-[#181725]">Payment</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold text-[#181725]">
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono text-xs">
                💳 Visa **** 4242
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Promo Code Row */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl">
            <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-base">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="text-[#181725]">Promo Code</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold text-[#181725]">
              <span className="text-gray-400 font-normal">Pick discount</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Total Cost Row */}
          <div className="py-4 flex items-center justify-between px-2">
            <span className="font-semibold text-base text-[#181725]">Total Cost</span>
            <span className="font-bold text-xl text-[#181725]">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Failure Simulation Switch */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700">Simulate Order Failure (for testing state)</span>
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="w-4 h-4 accent-red-500 rounded cursor-pointer"
          />
        </div>

        {/* Legal Disclaimer */}
        <p className="text-xs text-[#7C7C7C] leading-relaxed pt-2">
          By placing an order you agree to our{' '}
          <span className="text-[#53B175] font-semibold cursor-pointer underline">
            Terms and Conditions
          </span>
          .
        </p>

        {/* Action CTA */}
        <div className="pt-2">
          <PillButton onClick={handlePlaceOrder} isLoading={isProcessing}>
            Place Order
          </PillButton>
        </div>
      </div>
    </BottomSheet>
  );
};
