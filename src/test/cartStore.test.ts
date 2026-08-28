import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../stores/useCartStore';
import { INITIAL_PRODUCTS } from '../api/productsData';

describe('useCartStore — Challenge B: Self-Healing Cart Catalog Reconciliation', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().clearAllWarnings();
  });

  it('should initialize with an empty cart and clean warnings', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.resilienceWarnings).toEqual([]);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getSubtotal()).toBe(0);
  });

  it('should add items to cart and calculate correct subtotals', () => {
    const sampleProduct = INITIAL_PRODUCTS[0]; // Price $4.99
    useCartStore.getState().addItem(sampleProduct, 2);

    const state = useCartStore.getState();
    expect(state.getTotalItems()).toBe(2);
    expect(state.getSubtotal()).toBeCloseTo(sampleProduct.price * 2, 2);
  });

  it('Reconciliation Scenario 1: should update prices when catalog price shifts between sessions', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    const originalPrice = sampleProduct.price;

    // Add item with original price
    useCartStore.getState().addItem(sampleProduct, 1);

    // Simulate catalog price shift from $4.99 to $7.99
    sampleProduct.price = 7.99;

    // Trigger reconciliation
    useCartStore.getState().validateAndSyncCart();

    const state = useCartStore.getState();
    expect(state.items[0].addedAtPrice).toBe(7.99);
    expect(state.items[0].warning).toBe('price_changed');
    expect(state.resilienceWarnings.some((w) => w.includes('Price Update'))).toBe(true);

    // Restore original price to avoid side-effects
    sampleProduct.price = originalPrice;
  });

  it('Reconciliation Scenario 2: should cap cart quantity when item exceeds available stock limit', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    const originalStock = sampleProduct.stockQuantity;

    // Simulate item in cart with quantity 10
    useCartStore.getState().addItem(sampleProduct, 1);
    useCartStore.getState().items[0].quantity = 10;

    // Restrict stock to 4
    sampleProduct.stockQuantity = 4;

    // Trigger reconciliation
    useCartStore.getState().validateAndSyncCart();

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(4);
    expect(state.items[0].warning).toBe('stock_capped');
    expect(state.resilienceWarnings.some((w) => w.includes('Stock Adjusted'))).toBe(true);

    // Restore stock
    sampleProduct.stockQuantity = originalStock;
  });

  it('Reconciliation Scenario 3: should remove discontinued items missing from catalog', () => {
    // Manually insert a discontinued product into cart state
    useCartStore.setState({
      items: [
        {
          product: {
            id: 'discontinued-sku-999',
            name: 'Discontinued Soda',
            price: 2.99,
            unit: '355ml',
            categoryId: 'beverages',
            categoryName: 'Beverages',
            rating: 4.5,
            reviewsCount: 10,
            description: 'Discontinued beverage product',
            nutritionInfo: { weight: '355ml', organic: false },
            imageUrl: '',
            stockQuantity: 10,
            brand: 'MockBrand',
          },
          quantity: 2,
          addedAtPrice: 2.99,
        },
      ],
    });

    expect(useCartStore.getState().items.length).toBe(1);

    // Trigger reconciliation
    useCartStore.getState().validateAndSyncCart();

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
    expect(state.resilienceWarnings.some((w) => w.includes('Item Removed'))).toBe(true);
  });
});
