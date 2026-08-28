# 🏛️ Nectar Grocery App — System Architecture & Data Design

This document details the high-level architecture, module boundaries, unidirectional state flow, async simulation engine, and routing system of the **Nectar Grocery App**.

---

## 📐 Unidirectional Data Flow Architecture

The Nectar application is structured into four distinct architectural layers:

```
┌─────────────────────────────────────────────────────────┐
│              🛣️ React Router v7 URL Layer               │
│   (/, /explore, /category/:id, /product/:id, /cart, etc)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                🖥️ React View & UI Layer                 │
│  (NavbarDesktop, ProductGrid, CheckoutModal, Stepper)  │
└────────────────────────────┬────────────────────────────┘
                             │ dispatches actions
                             ▼
┌─────────────────────────────────────────────────────────┐
│            ⚡ Zustand Global State Store Layer           │
│   (useCartStore, useSearchStore, useOrderStore, etc)   │
└────────────────────────────┬────────────────────────────┘
                             │ invokes async queries
                             ▼
┌─────────────────────────────────────────────────────────┐
│           🌐 Simulated Latency & Data Service           │
│    (mockApi.ts, AbortSignal guards, productsData.ts)    │
└────────────────────────────┬────────────────────────────┘
```

---

## ⚡ Key Engineering Sub-Systems

### 1. Stale Search Response Protection Subsystem (Challenge A)
- **Goal**: Prevent out-of-order asynchronous responses from updating the UI during rapid keyboard dispatches.
- **Engine**: `useSearchStore.ts` + `mockApi.ts`
- **Mechanism**:
  - `AbortController.abort()` cancels prior network calls on new dispatches.
  - `activeRequestId` token validation verifies that incoming API responses match the latest request token.
  - Stale responses are discarded and registered in telemetry counters.

### 2. Persisted Cart Catalog Reconciliation Subsystem (Challenge B)
- **Goal**: Detect price shifts, stock bounds, and discontinued items upon application rehydration.
- **Engine**: `useCartStore.ts` + Zustand `persist` middleware.
- **Mechanism**:
  - `validateAndSyncCart()` compares stored items against live catalog definitions on mount.
  - Automatically updates price subtotals, caps quantities to available stock, and removes deleted SKUs while displaying non-intrusive warning alert banners.

---

## 🛠️ Automated Testing & Quality Assurance Suite

The repository features a **Vitest + jsdom automated test suite** (`npm test`) configured in `vite.config.ts`:
- **`src/test/searchStore.test.ts`**: Fires overlapping slow (600ms) vs fast (50ms) search requests to explicitly prove that out-of-order stale responses are discarded and marked as `aborted`/`rejected_stale` in telemetry logs.
- **`src/test/cartStore.test.ts`**: Tests 3 explicit catalog reconciliation edge cases: catalog price shifts (updating `addedAtPrice`), stock bound capping (reducing quantity to `stockQuantity`), and discontinued product removal (purging missing SKUs from cart state).
