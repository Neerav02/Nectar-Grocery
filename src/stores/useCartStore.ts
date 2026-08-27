import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { INITIAL_PRODUCTS } from '../api/productsData';

interface CartState {
  items: CartItem[];
  resilienceWarnings: string[];
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  validateAndSyncCart: () => void;
  dismissWarning: (index: number) => void;
  clearAllWarnings: () => void;
  
  // Selectors
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      resilienceWarnings: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
          let updatedItems = [...state.items];
          let warningMsg: string | undefined;

          if (existingIndex > -1) {
            const currentItem = updatedItems[existingIndex];
            const newQty = currentItem.quantity + quantity;
            const finalQty = Math.min(newQty, product.stockQuantity);

            if (newQty > product.stockQuantity) {
              warningMsg = `Stock limit reached: Capped '${product.name}' at max stock of ${product.stockQuantity}.`;
            }

            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: finalQty,
              product: product, // sync latest product
            };
          } else {
            const finalQty = Math.min(quantity, product.stockQuantity);
            if (quantity > product.stockQuantity) {
              warningMsg = `Stock limit reached: Capped '${product.name}' at max stock of ${product.stockQuantity}.`;
            }

            updatedItems.push({
              product,
              quantity: finalQty,
              addedAtPrice: product.price,
            });
          }

          const warnings = warningMsg
            ? [...state.resilienceWarnings, warningMsg]
            : state.resilienceWarnings;

          return { items: updatedItems, resilienceWarnings: warnings };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const warnings = [...state.resilienceWarnings];
          const updatedItems = state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stockQuantity;
              if (quantity > maxStock) {
                warnings.push(
                  `Cannot add more '${item.product.name}': only ${maxStock} unit(s) available in stock.`
                );
                return { ...item, quantity: maxStock };
              }
              return { ...item, quantity };
            }
            return item;
          });

          return { items: updatedItems, resilienceWarnings: warnings };
        });
      },

      clearCart: () => set({ items: [] }),

      // Resilience Validator (Engineering Challenge B)
      validateAndSyncCart: () => {
        set((state) => {
          const newWarnings: string[] = [];
          const validatedItems: CartItem[] = [];

          state.items.forEach((cartItem) => {
            // Check 1: Does product still exist in dataset?
            const latestProduct = INITIAL_PRODUCTS.find((p) => p.id === cartItem.product.id);

            if (!latestProduct) {
              newWarnings.push(
                `Item Removed: '${cartItem.product.name}' is no longer available in our store and was removed from your cart.`
              );
              return; // Exclude missing product
            }

            let itemToSave = { ...cartItem, product: latestProduct };

            // Check 2: Has price changed since cart persistence?
            if (latestProduct.price !== cartItem.addedAtPrice) {
              newWarnings.push(
                `Price Update: '${latestProduct.name}' price updated from $${cartItem.addedAtPrice.toFixed(
                  2
                )} to $${latestProduct.price.toFixed(2)}.`
              );
              itemToSave.previousPrice = cartItem.addedAtPrice;
              itemToSave.addedAtPrice = latestProduct.price;
              itemToSave.warning = 'price_changed';
            }

            // Check 3: Does quantity exceed stock?
            if (cartItem.quantity > latestProduct.stockQuantity) {
              newWarnings.push(
                `Stock Adjusted: '${latestProduct.name}' quantity reduced from ${cartItem.quantity} to ${latestProduct.stockQuantity} due to limited stock.`
              );
              itemToSave.quantity = latestProduct.stockQuantity;
              itemToSave.warning = 'stock_capped';
            }

            validatedItems.push(itemToSave);
          });

          return {
            items: validatedItems,
            resilienceWarnings: [...state.resilienceWarnings, ...newWarnings],
          };
        });
      },

      dismissWarning: (index) => {
        set((state) => ({
          resilienceWarnings: state.resilienceWarnings.filter((_, i) => i !== index),
        }));
      },

      clearAllWarnings: () => set({ resilienceWarnings: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'nectar_cart_storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
