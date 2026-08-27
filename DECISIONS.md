# Nectar Grocery App — Architectural & Technical Decisions

This document records non-trivial engineering decisions, trade-offs, and design choices made during the implementation of the Nectar Grocery App.

---

## 1. Stale Search Response Protection (Engineering Challenge A)

- **Ambiguity / Problem:** In asynchronous search interfaces with variable backend network latency (200ms–1200ms), rapid user typing produces out-of-order API responses. If a user types `"milk"` (Request A, 1200ms delay) and then changes to `"apple"` (Request B, 200ms delay), Request B completes first. When Request A eventually resolves 1 second later, a naïve implementation will overwrite the UI with stale `"milk"` results while the search box displays `"apple"`.
- **Options Considered:**
  1. *Simple Debouncing Only:* Reduce API requests by waiting 300ms. *Rejected:* Does not prevent race conditions if network latency fluctuates.
  2. *Last-Write-Wins (Timestamp Tagging):* Store timestamp of latest query and ignore responses with older timestamps. *Feasible, but leaves orphan requests running.*
  3. *AbortController + Request ID Token Guard (Chosen):* Abort pending HTTP/fetch requests via `AbortController.abort()` when a new query starts AND compare `requestId` before committing state to Zustand.
- **Choice Made & Trade-off:** Implemented dual-layer protection using `AbortController` and an explicit `activeRequestId` store check in `useSearchStore.ts`. In addition, built an interactive **Stale Search Debug Panel** in the UI to allow reviewers to trigger artificial out-of-order delays and toggle protection ON/OFF to observe the behavior in real time.
- **Trade-off:** Slightly increased store logic complexity in exchange for zero race conditions and instant request cancellation.

---

## 2. Persisted Cart Consistency & Resilience (Engineering Challenge B)

- **Ambiguity / Problem:** The cart is persisted across browser reloads using `localStorage`. Between sessions, catalog data may change: products may be discontinued, prices may be updated by merchants, or available stock may decrease below saved quantities.
- **Options Considered:**
  1. *Silent Cart Wipe:* Clear cart if any mismatch occurs. *Rejected:* Terrible user experience.
  2. *Silent Auto-Update:* Silently change prices and stock without telling the user. *Rejected:* Causes checkout confusion when subtotals change silently.
  3. *Explicit Resilience Synchronizer with User Warnings (Chosen):* On application mount (`validateAndSyncCart()`), compare persisted cart items against current catalog:
     - Discontinued items are cleanly removed and flagged (`Item Removed`).
     - Price changes update the item price while displaying a comparative warning badge (`Price Updated from $X to $Y`).
     - Stock limits cap item quantity to max stock and inform the user (`Stock Adjusted`).
- **Choice Made & Trade-off:** Option 3 implemented in `useCartStore.ts`.
- **Trade-off:** Requires keeping initial price metadata in persisted cart items, but ensures complete transparency and prevents cart crashes.

---

## 3. Filter Modal Draft State Architecture

- **Ambiguity / Problem:** When users open the Category/Brand Filter Sheet modal, checking checkboxes could immediately trigger catalog refetches and UI re-renders, causing lag or accidental filters.
- **Options Considered:**
  1. *Immediate Store Mutation:* Update global search/category state on every checkbox click. *Rejected:* Triggers unnecessary network calls while user is selecting multiple filters.
  2. *Local Component State:* Store draft state in `FilterSheet` local `useState`. *Rejected:* Hard to reset or sync across top navbar filter triggers and mobile filter buttons.
  3. *Dual Zustand Store State (`appliedFilters` vs `draftFilters`):* Maintain draft selections in `useFilterStore` when sheet opens. Only commit `draftFilters` to `appliedFilters` when "Apply Filter" is clicked.
- **Choice Made & Trade-off:** Option 3 chosen.
- **Trade-off:** Slightly higher store payload, but clean separation of concerns and predictable user intent execution.
