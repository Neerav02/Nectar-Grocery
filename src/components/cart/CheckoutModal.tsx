import React, { useState } from 'react';
import {
  ChevronRight,
  CreditCard,
  Tag,
  Truck,
  MapPin,
  Check,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToastStore } from '../../stores/useToastStore';
import { useOrderStore } from '../../stores/useOrderStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

type PaymentMethodType = 'upi_gpay' | 'upi_phonepe' | 'card_visa' | 'card_master' | 'cod' | 'wallet';
type DeliveryMethodType = 'express' | 'standard' | 'scheduled';

interface PromoOffer {
  code: string;
  description: string;
  type: 'percent' | 'flat' | 'free_ship';
  value: number;
}

const AVAILABLE_PROMOS: PromoOffer[] = [
  { code: 'NECTAR10', description: '10% OFF on all groceries', type: 'percent', value: 10 },
  { code: 'FREESHIP', description: 'Free Delivery on orders above $10', type: 'free_ship', value: 0 },
  { code: 'SAVE2', description: 'Flat $2.00 Instant Discount', type: 'flat', value: 2 },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const { items, getSubtotal } = useCartStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const { userLocation } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const addOrder = useOrderStore((state) => state.addOrder);

  const subtotal = getSubtotal();

  // Selection states
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi_gpay');
  const [appliedPromo, setAppliedPromo] = useState<PromoOffer | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Drawer Toggles
  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [showPromoPicker, setShowPromoPicker] = useState(false);

  // Failure simulation toggle
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery Fees Calculation
  let baseDeliveryFee = 2.0;
  if (deliveryMethod === 'standard') {
    baseDeliveryFee = subtotal >= 15 ? 0 : 1.0;
  } else if (deliveryMethod === 'scheduled') {
    baseDeliveryFee = 0.5;
  } else {
    baseDeliveryFee = 2.0;
  }

  if (appliedPromo?.type === 'free_ship') {
    baseDeliveryFee = 0;
  }

  const handlingFee = 0.49;
  const taxFee = Math.round(subtotal * 0.05 * 100) / 100;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(((subtotal * appliedPromo.value) / 100) * 100) / 100;
    } else if (appliedPromo.type === 'flat') {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + baseDeliveryFee + handlingFee + taxFee - discountAmount);

  const handleApplyPromoCode = (codeToApply: string) => {
    const matched = AVAILABLE_PROMOS.find(
      (p) => p.code.toUpperCase() === codeToApply.trim().toUpperCase()
    );

    if (matched) {
      setAppliedPromo(matched);
      setPromoError('');
      addToast(`Promo '${matched.code}' applied! 🎉`, 'success');
      setShowPromoPicker(false);
    } else {
      setPromoError('Invalid code. Try NECTAR10 or FREESHIP');
    }
  };

  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case 'upi_gpay':
        return '📱 Google Pay / UPI';
      case 'upi_phonepe':
        return '💜 PhonePe / BHIM UPI';
      case 'card_visa':
        return '💳 Visa **** 4242';
      case 'card_master':
        return '💳 Mastercard **** 8899';
      case 'cod':
        return '💵 Cash on Delivery';
      case 'wallet':
        return '👛 Nectar Wallet';
    }
  };

  const getDeliveryLabel = () => {
    switch (deliveryMethod) {
      case 'express':
        return `⚡ Express (15-20m) • $${baseDeliveryFee.toFixed(2)}`;
      case 'standard':
        return `🚚 Standard (45m) • ${baseDeliveryFee === 0 ? 'FREE' : '$' + baseDeliveryFee.toFixed(2)}`;
      case 'scheduled':
        return `📅 Eco Slot • $${baseDeliveryFee.toFixed(2)}`;
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onClose();

      if (simulateFailure) {
        onFailure();
      } else {
        // Record Order into Order Store
        addOrder({
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            unit: i.product.unit,
            price: i.addedAtPrice,
            quantity: i.quantity,
            imageUrl: i.product.imageUrl,
          })),
          subtotal,
          deliveryFee: baseDeliveryFee,
          handlingFee,
          taxFee,
          discountAmount,
          totalAmount: grandTotal,
          paymentMethod: getPaymentLabel(),
          deliveryAddress: `${userLocation.area}, ${userLocation.city}`,
        });

        clearCart();
        onSuccess();
      }
    }, 1000);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Checkout" maxWidth="xl">
      <div className="flex flex-col justify-between space-y-4 overflow-hidden select-none">
        
        {/* Delivery Address Row */}
        <div className="bg-[#EEF8F2] border border-[#53B175]/30 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <MapPin className="w-5 h-5 text-[#53B175] shrink-0" />
            <span className="text-sm font-extrabold text-[#181725] truncate">
              {userLocation.area}, {userLocation.city}
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#53B175] bg-white px-2.5 py-1 rounded-full border border-[#53B175]/30 shrink-0">
            Verified
          </span>
        </div>

        {/* Options List */}
        <div className="divide-y divide-[#F2F3F2] border-y border-[#F2F3F2] text-sm">
          
          {/* Delivery Speed Row */}
          <div className="py-3 flex flex-col">
            <div
              onClick={() => setShowDeliveryPicker(!showDeliveryPicker)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C]">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold text-sm">Delivery Speed</span>
              </div>
              <div className="flex items-center space-x-1.5 font-bold text-[#53B175]">
                <span className="text-sm">{getDeliveryLabel()}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {showDeliveryPicker && (
              <div className="mt-2 p-2.5 bg-[#F8F9FA] rounded-2xl space-y-1.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setDeliveryMethod('express'); setShowDeliveryPicker(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                    deliveryMethod === 'express' ? 'bg-[#EEF8F2] text-[#53B175] border border-[#53B175]' : 'bg-white text-[#181725]'
                  }`}
                >
                  <span>⚡ Express (15-20 Mins)</span>
                  <span>$2.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setDeliveryMethod('standard'); setShowDeliveryPicker(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                    deliveryMethod === 'standard' ? 'bg-[#EEF8F2] text-[#53B175] border border-[#53B175]' : 'bg-white text-[#181725]'
                  }`}
                >
                  <span>🚚 Standard (45 Mins)</span>
                  <span>{subtotal >= 15 ? 'FREE' : '$1.00'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Payment Method Row */}
          <div className="py-3 flex flex-col">
            <div
              onClick={() => setShowPaymentPicker(!showPaymentPicker)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C]">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold text-sm">Payment Method</span>
              </div>
              <div className="flex items-center space-x-1.5 font-bold text-[#181725]">
                <span className="text-sm">{getPaymentLabel()}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {showPaymentPicker && (
              <div className="mt-2 p-2.5 bg-[#F8F9FA] rounded-2xl space-y-1.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('upi_gpay'); setShowPaymentPicker(false); }}
                  className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl text-xs font-bold text-[#181725] hover:bg-gray-100"
                >
                  <span>📱 Google Pay / UPI</span>
                  {paymentMethod === 'upi_gpay' && <Check className="w-4 h-4 text-[#53B175]" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('upi_phonepe'); setShowPaymentPicker(false); }}
                  className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl text-xs font-bold text-[#181725] hover:bg-gray-100"
                >
                  <span>💜 PhonePe / BHIM UPI</span>
                  {paymentMethod === 'upi_phonepe' && <Check className="w-4 h-4 text-[#53B175]" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card_visa'); setShowPaymentPicker(false); }}
                  className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl text-xs font-bold text-[#181725] hover:bg-gray-100"
                >
                  <span>💳 Visa **** 4242</span>
                  {paymentMethod === 'card_visa' && <Check className="w-4 h-4 text-[#53B175]" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('cod'); setShowPaymentPicker(false); }}
                  className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl text-xs font-bold text-[#181725] hover:bg-gray-100"
                >
                  <span>💵 Cash on Delivery</span>
                  {paymentMethod === 'cod' && <Check className="w-4 h-4 text-[#53B175]" />}
                </button>
              </div>
            )}
          </div>

          {/* Promo Code Row */}
          <div className="py-3 flex flex-col">
            <div
              onClick={() => setShowPromoPicker(!showPromoPicker)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C]">
                <Tag className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold text-sm">Promo Code</span>
              </div>
              <div className="flex items-center space-x-1.5 font-bold text-[#181725]">
                {appliedPromo ? (
                  <span className="text-[#53B175] bg-[#EEF8F2] px-2.5 py-1 rounded-lg text-xs font-extrabold">
                    🏷️ {appliedPromo.code} (-${discountAmount.toFixed(2)})
                  </span>
                ) : (
                  <span className="text-gray-400 font-normal text-sm">Pick discount offer</span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {showPromoPicker && (
              <div className="mt-2 p-2.5 bg-[#F8F9FA] rounded-2xl space-y-2 border border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE (NECTAR10)"
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs uppercase font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromoCode(promoInput)}
                    className="bg-[#53B175] text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 font-bold">{promoError}</p>}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {AVAILABLE_PROMOS.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => handleApplyPromoCode(p.code)}
                      className="bg-white border text-[#53B175] px-2.5 py-1 rounded-lg text-xs font-extrabold hover:bg-[#EEF8F2]"
                    >
                      {p.code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bill Summary Box */}
        <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-1.5 border border-gray-200 text-xs sm:text-sm">
          <div className="flex items-center justify-between text-[#7C7C7C] font-semibold">
            <span>Items Subtotal</span>
            <span className="text-[#181725] font-extrabold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[#7C7C7C] font-semibold">
            <span>Delivery Fee ({deliveryMethod})</span>
            <span className="text-[#181725] font-extrabold">
              {baseDeliveryFee === 0 ? 'FREE' : `$${baseDeliveryFee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#7C7C7C] font-semibold">
            <span>Packaging & GST (5%)</span>
            <span className="text-[#181725] font-extrabold">${(handlingFee + taxFee).toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-[#53B175] font-bold">
              <span>Promo Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-base font-extrabold text-[#181725]">
            <span>Grand Total</span>
            <span className="text-[#53B175] text-lg font-extrabold">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Discreet Simulation Switch */}
        <div className="flex items-center justify-between px-1 text-xs text-gray-500">
          <span className="font-semibold">
            Simulation Test: {simulateFailure ? '🔴 Fail Mode' : '🟢 Success Mode'}
          </span>
          <button
            type="button"
            onClick={() => setSimulateFailure(!simulateFailure)}
            className="text-xs font-bold text-[#53B175] underline hover:text-[#439c63]"
          >
            Toggle Mode
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <PillButton onClick={handlePlaceOrder} isLoading={isProcessing}>
            Place Order • ${grandTotal.toFixed(2)}
          </PillButton>
        </div>
      </div>
    </BottomSheet>
  );
};
