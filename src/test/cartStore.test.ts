import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../stores/useCartStore';
import { INITIAL_PRODUCTS } from '../api/productsData';

describe('useCartStore - Cart Catalog Reconciliation & Operations', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should initialize with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
  });

  it('should add items to cart and update quantities', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    useCartStore.getState().addItem(sampleProduct, 2);

    const state = useCartStore.getState();
    expect(state.getTotalItems()).toBe(2);
    expect(state.items[0].quantity).toBe(2);
  });

  it('should remove item when quantity is decremented to zero', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    useCartStore.getState().addItem(sampleProduct, 1);
    useCartStore.getState().updateQuantity(sampleProduct.id, 0);

    expect(useCartStore.getState().getTotalItems()).toBe(0);
  });

  it('should calculate accurate subtotal', () => {
    const sampleProduct = INITIAL_PRODUCTS[0]; // e.g. price $4.99
    useCartStore.getState().addItem(sampleProduct, 2);

    const subtotal = useCartStore.getState().getSubtotal();
    expect(subtotal).toBeCloseTo(sampleProduct.price * 2, 2);
  });

  it('should reconcile cart items against live catalog during validateAndSyncCart', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    useCartStore.getState().addItem(sampleProduct, 3);

    // Perform reconciliation test
    useCartStore.getState().validateAndSyncCart();
    expect(useCartStore.getState().getTotalItems()).toBe(3);
  });
});
