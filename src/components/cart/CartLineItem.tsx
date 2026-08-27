import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { CartItem } from '../../types';
import { QuantityStepper } from '../common/QuantityStepper';
import { useCartStore } from '../../stores/useCartStore';

interface CartLineItemProps {
  item: CartItem;
}

export const CartLineItem: React.FC<CartLineItemProps> = ({ item }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity, previousPrice, warning } = item;

  return (
    <div className="py-4 border-b border-[#F2F3F2] flex items-center justify-between gap-4 transition-colors hover:bg-gray-50/50 rounded-xl px-2">
      {/* Product Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F9FA] rounded-xl flex items-center justify-center p-2 shrink-0 border border-[#E2E2E2]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Details & Stepper */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-[#181725] text-base leading-tight truncate">
              {product.name}
            </h4>
            <p className="text-xs text-[#7C7C7C] font-medium mt-0.5">{product.unit}</p>

            {/* Warning tag if price or stock changed */}
            {warning === 'price_changed' && previousPrice && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mt-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Price was ${previousPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper and Price Row */}
        <div className="flex items-center justify-between mt-3">
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => updateQuantity(product.id, quantity + 1)}
            onDecrease={() => updateQuantity(product.id, quantity - 1)}
            max={product.stockQuantity}
            size="sm"
          />

          <span className="font-bold text-[#181725] text-lg">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
