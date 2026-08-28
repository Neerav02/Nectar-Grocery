# 🧠 Nectar Grocery App — Architectural & Technical Decisions Log

This document records non-trivial engineering decisions, technical trade-offs, state architecture choices, and resilience mechanisms implemented during the development of the Nectar Grocery web application.

---

## 1. Stale Search Response Protection Architecture (Engineering Challenge A)

### Problem & Context
In asynchronous search applications communicating with backends or simulated network layers featuring variable latency (200ms – 1200ms), rapid user typing produces out-of-order response execution. 

#### Race Condition Example:
1. User types `"milk"` ➔ Request A dispatched with 1200ms artificial network delay.
2. 100ms later, user backspaces and types `"apple"` ➔ Request B dispatched with 200ms network delay.
3. Request B resolves first (at `t = 300ms`), updating UI results to `"Organic Red Apples"`.
4. Request A resolves later (at `t = 1200ms`), overwriting state with `"Farm Fresh Milk"`.
5. **Bug**: The search input displays `"apple"`, but the product grid displays stale `"milk"` results!

### Technical Options Evaluated

| Strategy | Implementation Mechanics | Strengths | Weaknesses | Decision |
| :--- | :--- | :--- | :--- | :---: |
| **Option 1: Debouncing Only** | Delay request execution by 300ms using `useDebounce`. | Easy to implement. Reduces total network requests. | **Failed**: Does not prevent race conditions when network latency fluctuates. | ❌ Rejected |
| **Option 2: Timestamp Tagging** | Tag queries with `Date.now()` and discard responses with older timestamps. | Avoids stale state updates. | Leaves orphaned network requests running in the background. | ⚠️ Partial |
| **Option 3: AbortController + Token Guard** | Instantly abort pending HTTP fetch requests via `AbortController.abort()` AND validate `activeRequestId` token before committing state to Zustand. | Cancels in-flight requests immediately; zero race conditions; full telemetry control. | Requires careful cleanup logic inside Zustand actions. | ✅ **Selected** |

### Verified Actual Implementation (`src/stores/useSearchStore.ts`)
```typescript
interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Engineering Challenge A features
  isStaleProtectionEnabled: boolean;
  activeRequestId: string | null;
  requestLogs: RequestLogEntry[];
  
  // Actions
  setQuery: (query: string) => void;
  executeSearch: (searchQuery: string, forcedLatencyMs?: number) => Promise<void>;
  toggleStaleProtection: () => void;
  clearRequestLogs: () => void;
  resetSearch: () => void;
}

let activeAbortController: AbortController | null = null;

executeSearch: async (searchQuery: string, forcedLatencyMs?: number) => {
  const trimmed = searchQuery.trim();
  if (!trimmed) {
    set({ results: [], isLoading: false, error: null });
    return;
  }

  // Generate unique request ID
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const startTime = Date.now();

  // Guard 1: Abort previous pending network request if protection is enabled
  if (get().isStaleProtectionEnabled && activeAbortController) {
    activeAbortController.abort('New search request initiated');
  }

  const controller = new AbortController();
  if (get().isStaleProtectionEnabled) {
    activeAbortController = controller;
  }

  set((state) => ({
    isLoading: true,
    error: null,
    activeRequestId: requestId,
    requestLogs: [
      {
        id: requestId,
        query: trimmed,
        startedAt: startTime,
        latencyMs: forcedLatencyMs || 0,
        status: 'pending',
      },
      ...state.requestLogs,
    ],
  }));

  try {
    const response = await searchProductsApi(
      trimmed,
      requestId,
      get().isStaleProtectionEnabled ? controller.signal : undefined,
      forcedLatencyMs
    );

    const endTime = Date.now();
    const currentActiveId = get().activeRequestId;
    const isProtectionOn = get().isStaleProtectionEnabled;

    // Guard 2: Discard out-of-order stale responses if activeRequestId doesn't match
    if (isProtectionOn && response.requestId !== currentActiveId) {
      set((state) => ({
        requestLogs: state.requestLogs.map((log) =>
          log.id === requestId
            ? { ...log, completedAt: endTime, status: 'rejected_stale' }
            : log
        ),
      }));
      return;
    }

    // Valid current response
    set((state) => ({
      results: response.results,
      isLoading: false,
      requestLogs: state.requestLogs.map((log) =>
        log.id === requestId ? { ...log, completedAt: endTime, status: 'fulfilled' } : log
      ),
    }));
  } catch (err: unknown) {
    const errorObj = err as { name?: string; message?: string };
    if (errorObj?.name === 'AbortError') {
      set((state) => ({
        requestLogs: state.requestLogs.map((log) =>
          log.id === requestId
            ? { ...log, completedAt: Date.now(), status: 'aborted' }
            : log
        ),
      }));
      return;
    }

    set((state) => ({
      isLoading: false,
      error: errorObj?.message || 'Search failed',
      requestLogs: state.requestLogs.map((log) =>
        log.id === requestId ? { ...log, completedAt: Date.now(), status: 'rejected_stale' } : log
      ),
    }));
  }
}
```

### Trade-offs & Verification
- **Trade-off**: Requires holding an `AbortController` instance in store state, slightly increasing state management complexity.
- **Verification**: Built an interactive **Stale Search Debug Panel** on the Search page allowing reviewers to trigger artificial out-of-order delays ("milk" vs "apple" race test) and toggle protection ON/OFF to visually verify state isolation.

---

## 2. Persisted Cart Consistency & Resilience Architecture (Engineering Challenge B)

### Problem & Context
The user's cart is persisted across browser reloads using Zustand's `persist` middleware backed by `localStorage`. Over time, the underlying product catalog can change between sessions:
- Products saved in a user's cart may be discontinued.
- Product prices may be updated by merchants.
- Stock availability may decrease below the user's saved cart quantity.

Naive implementations crash with `TypeError: Cannot read properties of undefined` or silently show incorrect subtotals at checkout.

### Technical Options Evaluated

| Strategy | User Experience Impact | Data Integrity | Decision |
| :--- | :--- | :--- | :---: |
| **Option 1: Silent Cart Reset** | Cart is completely wiped whenever any mismatch occurs. | Prevents crashes, but infuriates users by clearing their saved items. | ❌ Rejected |
| **Option 2: Silent Price Update** | Item prices update silently without notifying the user. | Keeps totals accurate, but causes checkout confusion when total bill shifts. | ❌ Rejected |
| **Option 3: On-Mount Catalog Sync (`validateAndSyncCart`)** | Compares saved cart items against live catalog metadata on mount. Discontinued items are removed with toast alerts; price shifts update totals with comparative warning badges (`Price updated from $X to $Y`); stock limits cap item quantities gracefully. | Preserves valid items, maintains 100% price accuracy, and provides full transparency. | ✅ **Selected** |

### Verified Actual Implementation (`src/stores/useCartStore.ts`)
```typescript
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

      // Check 3: Does quantity exceed available stock?
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
}
```

---

## 3. Dual-Store Draft State Pattern for Multi-Category Filters

### Problem & Context
Updating global search/category state immediately when a user clicks checkboxes in a filter drawer causes premature catalog refetches, UI re-renders, and accidental filter applications before the user finishes selecting options.

### Solution & Choice
Implemented a **Dual-Store Draft State Pattern** inside `useFilterStore.ts`:
- `draftFilters`: Temporary state updated as the user checks/unchecks categories, price sliders, or rating filters inside the `FilterSheet`.
- `appliedFilters`: Active state used by the `SearchPage` product grid.
- **Commit Phase**: `appliedFilters` is ONLY updated when the user explicitly clicks the **"Apply Filter"** button.

---

## 4. Modal Container Component Abstraction (`BottomSheet`)

### Problem & Context
Creating separate overlay modals for Checkout, Location Selector, Auth, Filter Sheet, and Order Results would duplicate backdrop blur, animation listeners, keyboard dismissal hooks, and viewport sizing logic.

### Solution & Choice
Created a unified `BottomSheet` container component:
- Accepts `maxWidth` variant props (`sm`, `md`, `lg`, `xl`, `2xl`).
- Handles `Escape` key dismissal and backdrop clicks centrally.
- Renders full-bleed slide-up sheets on mobile (`< 640px`) and centered backdrop-blurred dialog cards on desktop (`≥ 640px`).
