import React, { useEffect } from 'react';
import { CartLineItem } from '../components/cart/CartLineItem';
import { CartResilienceNotice } from '../components/cart/CartResilienceNotice';
import { EmptyState } from '../components/common/EmptyState';
import { PillButton } from '../components/common/PillButton';
import { useCartStore } from '../stores/useCartStore';

interface CartPageProps {
  onGoToCheckout: () => void;
  onExplore: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onGoToCheckout, onExplore }) => {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const validateAndSyncCart = useCartStore((state) => state.validateAndSyncCart);

  // Validate cart resilience on page load
  useEffect(() => {
    validateAndSyncCart();
  }, [validateAndSyncCart]);

  const subtotal = getSubtotal();

  return (
    <div className="space-y-6 pb-28 md:pb-12 animate-fade-in">
      {/* Title */}
      <h1 className="text-2xl font-extrabold text-[#181725] text-center tracking-tight pb-2 border-b border-[#F2F3F2]">
        My Cart
      </h1>

      {/* Challenge B Resilience Alerts */}
      <CartResilienceNotice />

      {/* Cart Content */}
      {items.length === 0 ? (
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added any fresh groceries to your basket yet."
          actionText="Start Shopping"
          onAction={onExplore}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <CartLineItem key={item.product.id} item={item} />
          ))}

          {/* Sticky Bottom Checkout CTA Button */}
          <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#F2F3F2] z-30 max-w-md mx-auto sm:max-w-none">
            <PillButton onClick={onGoToCheckout} size="lg">
              <div className="w-full flex items-center justify-between px-2">
                <span>Go to Checkout</span>
                <span className="bg-[#439B63] text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
};
