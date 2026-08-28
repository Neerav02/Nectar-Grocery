import React, { useState } from 'react';
import {
  ChevronRight,
  CreditCard,
  Tag,
  Truck,
  MapPin,
  Check,
  Zap,
  Clock,
  ShieldCheck,
  QrCode,
  Banknote,
  Wallet,
  Receipt,
} from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { PillButton } from '../common/PillButton';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToastStore } from '../../stores/useToastStore';

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
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const { userLocation } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

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
    // Express 15-20 min
    baseDeliveryFee = 2.0;
  }

  if (appliedPromo?.type === 'free_ship') {
    baseDeliveryFee = 0;
  }

  // Handling & Packaging Fee
  const handlingFee = 0.49;

  // Taxes (5%)
  const taxFee = Math.round(subtotal * 0.05 * 100) / 100;

  // Promo Discount Calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(((subtotal * appliedPromo.value) / 100) * 100) / 100;
    } else if (appliedPromo.type === 'flat') {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  // Grand Total
  const grandTotal = Math.max(0, subtotal + baseDeliveryFee + handlingFee + taxFee - discountAmount);

  // Apply Promo Action
  const handleApplyPromoCode = (codeToApply: string) => {
    const matched = AVAILABLE_PROMOS.find(
      (p) => p.code.toUpperCase() === codeToApply.trim().toUpperCase()
    );

    if (matched) {
      setAppliedPromo(matched);
      setPromoError('');
      addToast(`Promo '${matched.code}' applied successfully! 🎉`, 'success');
      setShowPromoPicker(false);
    } else {
      setPromoError('Invalid code. Try NECTAR10 or FREESHIP');
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
        clearCart();
        onSuccess();
      }
    }, 1200);
  };

  // Payment Label Renderer
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
        return '👛 Nectar Pay Wallet ($45.00)';
    }
  };

  // Delivery Label Renderer
  const getDeliveryLabel = () => {
    switch (deliveryMethod) {
      case 'express':
        return `⚡ Express (15-20 m) - $${baseDeliveryFee.toFixed(2)}`;
      case 'standard':
        return `🚚 Standard (45 m) - ${baseDeliveryFee === 0 ? 'FREE' : '$' + baseDeliveryFee.toFixed(2)}`;
      case 'scheduled':
        return `📅 Eco Slot (Tomorrow) - $${baseDeliveryFee.toFixed(2)}`;
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Checkout">
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* ── Scrollable Checkout Body ── */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-thin">
          
          {/* Address Card */}
          <div className="bg-[#EEF8F2]/60 border border-[#53B175]/30 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#53B175] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-[#53B175] uppercase tracking-wider">
                  Delivering To
                </p>
                <p className="text-sm font-bold text-[#181725] leading-tight">
                  {userLocation.area}, {userLocation.city}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#53B175] bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-[#53B175]/20">
              Verified
            </span>
          </div>

          {/* Interactive Options Table */}
          <div className="divide-y divide-[#F2F3F2] border-y border-[#F2F3F2] bg-white rounded-2xl">
            
            {/* Delivery Option Trigger */}
            <div
              onClick={() => setShowDeliveryPicker(!showDeliveryPicker)}
              className="py-3.5 px-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-sm">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold">Delivery Speed</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#181725]">
                <span className="text-[#53B175]">{getDeliveryLabel()}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Delivery Picker Sub-Drawer */}
            {showDeliveryPicker && (
              <div className="p-3 bg-[#F8F9FA] space-y-2 rounded-xl border border-gray-100">
                <p className="text-xs font-extrabold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Choose Delivery Speed:
                </p>
                
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('express');
                    setShowDeliveryPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    deliveryMethod === 'express'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>⚡ Express Instant (15-20 Mins)</span>
                  </div>
                  <span>$2.00</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('standard');
                    setShowDeliveryPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    deliveryMethod === 'standard'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>🚚 Standard Delivery (45 Mins)</span>
                  </div>
                  <span>{subtotal >= 15 ? 'FREE' : '$1.00'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('scheduled');
                    setShowDeliveryPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    deliveryMethod === 'scheduled'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                    <span>📅 Scheduled Slot (Tomorrow Morning)</span>
                  </div>
                  <span>$0.50</span>
                </button>
              </div>
            )}

            {/* Payment Method Trigger */}
            <div
              onClick={() => setShowPaymentPicker(!showPaymentPicker)}
              className="py-3.5 px-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-sm">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold">Payment Method</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#181725]">
                <span>{getPaymentLabel()}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Payment Picker Sub-Drawer */}
            {showPaymentPicker && (
              <div className="p-3 bg-[#F8F9FA] space-y-2 rounded-xl border border-gray-100">
                <p className="text-xs font-extrabold text-[#7C7C7C] uppercase tracking-wider mb-1">
                  Select Payment Option:
                </p>

                {/* Google Pay / UPI */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi_gpay');
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'upi_gpay'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>📱 Google Pay / UPI</span>
                  </div>
                  {paymentMethod === 'upi_gpay' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi_phonepe');
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'upi_phonepe'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span>💜 PhonePe / BHIM UPI</span>
                  </div>
                  {paymentMethod === 'upi_phonepe' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Visa Card */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card_visa');
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'card_visa'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>💳 Visa Card ending in 4242</span>
                  </div>
                  {paymentMethod === 'card_visa' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('cod');
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>💵 Cash on Delivery (COD)</span>
                  </div>
                  {paymentMethod === 'cod' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Nectar Wallet */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('wallet');
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#EEF8F2] border-[#53B175] text-[#53B175]'
                      : 'bg-white border-gray-200 text-[#181725]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-amber-600" />
                    <span>👛 Nectar Wallet ($45.00 Balance)</span>
                  </div>
                  {paymentMethod === 'wallet' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
            )}

            {/* Promo Code Trigger */}
            <div
              onClick={() => setShowPromoPicker(!showPromoPicker)}
              className="py-3.5 px-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-[#7C7C7C] font-semibold text-sm">
                <Tag className="w-5 h-5 text-gray-600" />
                <span className="text-[#181725] font-extrabold">Promo Discount</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#181725]">
                {appliedPromo ? (
                  <span className="bg-[#EEF8F2] text-[#53B175] px-2.5 py-0.5 rounded-full border border-[#53B175]/30">
                    🏷️ {appliedPromo.code} (-${discountAmount.toFixed(2)})
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium">Pick discount offer</span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Promo Code Drawer */}
            {showPromoPicker && (
              <div className="p-3 bg-[#F8F9FA] space-y-3 rounded-xl border border-gray-100">
                {/* Code input form */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter Code (e.g. NECTAR10)"
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#181725] uppercase outline-none focus:border-[#53B175]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromoCode(promoInput)}
                    className="bg-[#53B175] text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-[#439c63] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {promoError && <p className="text-[11px] font-bold text-red-500">{promoError}</p>}

                <p className="text-[11px] font-extrabold text-[#7C7C7C] uppercase tracking-wider">
                  Available Offers:
                </p>
                <div className="space-y-1.5">
                  {AVAILABLE_PROMOS.map((p) => (
                    <div
                      key={p.code}
                      onClick={() => handleApplyPromoCode(p.code)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[#53B175] transition-colors"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-[#53B175] bg-[#EEF8F2] px-2 py-0.5 rounded-md">
                          {p.code}
                        </span>
                        <span className="text-xs font-medium text-[#181725] ml-2">
                          {p.description}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#53B175]">Apply</span>
                    </div>
                  ))}
                </div>

                {appliedPromo && (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null);
                      addToast('Promo code removed', 'info');
                    }}
                    className="text-xs font-bold text-red-500 hover:underline pt-1 block"
                  >
                    Remove Applied Promo
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Transparent Charges Breakdown ── */}
          <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-2 border border-gray-200">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-1">
              <Receipt className="w-4 h-4 text-[#53B175]" />
              <h4 className="text-xs font-extrabold text-[#181725] uppercase tracking-wider">
                Bill Summary
              </h4>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-[#7C7C7C]">
              <span>Items Subtotal</span>
              <span className="font-bold text-[#181725]">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-[#7C7C7C]">
              <span>Delivery Fee ({deliveryMethod})</span>
              <span className="font-bold text-[#181725]">
                {baseDeliveryFee === 0 ? (
                  <span className="text-[#53B175] font-extrabold">FREE</span>
                ) : (
                  `$${baseDeliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-[#7C7C7C]">
              <span>Handling & Eco Packaging</span>
              <span className="font-bold text-[#181725]">${handlingFee.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-[#7C7C7C]">
              <span>Govt Taxes & GST (5%)</span>
              <span className="font-bold text-[#181725]">${taxFee.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs font-bold text-[#53B175]">
                <span>Promo Discount ({appliedPromo?.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-base font-extrabold text-[#181725]">
              <span>Grand Total</span>
              <span className="text-[#53B175] text-xl font-extrabold">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Clean Simulator Mode Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <span>⚡ Simulation State:</span>
              <span className={simulateFailure ? 'text-red-600' : 'text-emerald-700'}>
                {simulateFailure ? 'Fail Order (Error Test)' : 'Success Order (Normal)'}
              </span>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-emerald-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500" />
            </label>
          </div>

          {/* Legal Terms */}
          <p className="text-[11px] text-[#7C7C7C] leading-snug text-center">
            By placing an order you agree to our{' '}
            <span className="text-[#53B175] font-semibold cursor-pointer underline">
              Terms & Conditions
            </span>
          </p>
        </div>

        {/* ── Sticky Bottom Action Bar ── */}
        <div className="pt-3 border-t border-[#F2F3F2] shrink-0 bg-white z-10">
          <PillButton onClick={handlePlaceOrder} isLoading={isProcessing}>
            Place Order • ${grandTotal.toFixed(2)}
          </PillButton>
        </div>
      </div>
    </BottomSheet>
  );
};
