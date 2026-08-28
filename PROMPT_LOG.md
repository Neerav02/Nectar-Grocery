# 🤖 Nectar Grocery App — AI Prompt Log & Supervision Record

This document records the material AI prompts, architectural directives, human supervision decisions, and manual corrections made during the development of the Nectar Grocery App using **Claude Code (Claude 3.7 Sonnet)**.

---

## 📊 Comprehensive AI Execution & Prompt Audit

| Prompt ID | AI Model / Tool | Developer Prompt & Objective | Action Taken & Architectural Choice | Verification & Validation Method |
| :--- | :--- | :--- | :--- | :--- |
| **P-01** | **Claude Code** (Claude 3.7 Sonnet) | Scaffold production Vite + React 18 + Strict TypeScript + Tailwind CSS project structure matching Nectar design system. | Generated project scaffolding, set up strict `tsconfig.json`, configured Tailwind CSS v4, and established store module boundaries. | Executed `npx tsc --noEmit` and `npm run build`; verified zero compilation errors. |
| **P-02** | **Claude Code** (Claude 3.7 Sonnet) | Parse 28 Nectar Figma reference screens. Extract design tokens (`#53B175`), fonts (Sen), and component boundaries. | Created design token catalog in `index.css`, built pastel category card definitions, and initialized `productsData.ts`. | Visual side-by-side comparison against Figma reference screenshots in `public/design-references`. |
| **P-03** | **Claude Code** (Claude 3.7 Sonnet) | Solve Engineering Challenge A: Implement stale search response protection for out-of-order async requests. | Built `useSearchStore.ts` utilizing `AbortController.abort()` and `activeRequestId` token validation. Created interactive `StaleSearchDebugPanel`. | Triggered race condition test ("milk" vs "apple") in debug panel; verified state isolation. |
| **P-04** | **Claude Code** (Claude 3.7 Sonnet) | Solve Engineering Challenge B: Implement persisted cart resilience for price shifts, out-of-stock limits, and deleted items. | Implemented `validateAndSyncCart()` in `useCartStore.ts` with Zustand `persist` middleware and resilience warning alert badges. | Simulated catalog price shifts in `localStorage`; verified automatic total adjustments and alerts. |
| **P-05** | **Claude Code** (Claude 3.7 Sonnet) | Refine Desktop Navigation: Replace mobile bottom bar with sticky desktop header navbar (`NavbarDesktop`) on viewports `≥ 768px`. | Built `NavbarDesktop` with enlarged carrot logo mark, location picker pill, central search, section tabs, and cart/favourites badge counters. | Responsive breakpoint testing at 375px, 768px, 1024px, and 1440px viewports. |
| **P-06** | **Claude Code** (Claude 3.7 Sonnet) | Redesign Checkout Modal to single-card layout (`maxWidth="xl"`) with zero internal scrollbars. | Expanded `BottomSheet` max-width variants to `xl` (~672px), increased row padding, and reformatted bill itemization hierarchy. | Verified checkout dialog rendered in a single spacious card without vertical scrollbars. |
| **P-07** | **Claude Code** (Claude 3.7 Sonnet) | Implement post-login routing and profile navigation logic according to Blinkit-style user flow. | Updated `App.tsx` and `AccountPage.tsx` so completing auth lands on the Shop page, while clicking Demo/Profile opens the Profile menu (`'menu'`). | End-to-end user navigation testing across login, shop browsing, and account profile views. |
| **P-08** | **Claude Code** (Claude 3.7 Sonnet) | Implement live order tracking stepper with automated status progression timer in `AccountPage.tsx`. | Built 4-step progress stepper (**Order Placed ➔ Packing ➔ Out for Delivery ➔ Delivered**) with automated 12s status timer and delivery driver details. | Placed order in Checkout, verified real-time stepper advancement every 12 seconds in Account dashboard. |
| **P-09** | **Claude Code** (Claude 3.7 Sonnet) | Audit codebase for assignment rubric alignment: integrate React Router v7, sync DECISIONS.md snippets, and declare explicit dependencies. | Refactored `App.tsx` to use `react-router-dom` (`<Routes>`, `<Route>`, `useNavigate`, `useLocation`), copied exact store code to `DECISIONS.md`, declared `react`/`react-dom` explicitly in `package.json`, and replaced self-graded table with an objective feature summary. | Executed `npx tsc --noEmit` (0 errors), `npm run build`, and verified URL routing across `/`, `/explore`, `/category/:id`, `/product/:id`, `/cart`, `/account`. |
| **P-10** | **Claude Code** (Claude 3.7 Sonnet) | Implement URL search parameter synchronization and celebratory confetti order completion interactions. | Synchronized `SearchPage.tsx` search inputs with `useSearchParams` (`?q=query`) and integrated `canvas-confetti` in `OrderSuccessModal.tsx`. | Tested deep URL search queries and verified confetti explosion on order placement. |
| **P-11** | **Claude Code** (Claude 3.7 Sonnet) | Build real-time offline network connectivity monitor (`OfflineBanner.tsx`) and document Vercel SPA rewrite teardown. | Built `OfflineBanner.tsx` with `navigator.onLine` event listeners and documented `vercel.json` SPA rewrite resolution in `DEBUGGING.md`. | Simulated offline mode in DevTools network tab; verified warning banner hydration. |
| **P-12** | **Claude Code** (Claude 3.7 Sonnet) | Eliminate `nectar_cart_storage` test warnings by configuring `jsdom` environment in `vite.config.ts`. | Installed `jsdom` (`npm install -D jsdom`) and configured `test: { environment: 'jsdom' }` in `vite.config.ts`. | Executed `npm test`; verified 100% clean test execution with zero storage warnings. |
| **P-13** | **Claude Code** (Claude 3.7 Sonnet) | Strengthen test suite to rigorously prove Challenge A (async race condition) and Challenge B (price shift, stock limit, discontinued SKU removal). | Rewrote `searchStore.test.ts` to execute overlapping slow (600ms) vs fast (50ms) requests, and `cartStore.test.ts` to test 3 catalog reconciliation scenarios. | Executed `npx vitest run`; verified 8/8 tests passed with exact assertion coverage. |

---

## 🛠️ What AI Got Wrong & Human Supervision Corrections

### 1. Copy Remediation & Figma Typo Corrections
- **AI Initial Output**: The AI assistant initially copied raw string literals directly from the imported Figma design kit, reproducing several obvious Figma design typos:
  - `"online groceriet"` (tagline)
  - `"Loging"` (header label)
  - `"Sing Up"` (button CTA)
  - `"Pament"` (checkout row)
  - `"Something went tembly wrong"` (failure modal error text)
- **Human Correction**: Conducted a systematic copy audit across all component files, string constants, and modal titles. Standardized terminology to production standards (`"online groceries"`, `"Log In"`, `"Sign Up"`, `"Payment"`, `"Something went wrong"`).

### 2. Debouncing vs. AbortController for Async Race Conditions
- **AI Initial Output**: When asked to implement search response protection, the AI initially suggested a standard `useDebounce` hook, assuming that delaying request invocation by 300ms resolves race conditions.
- **Human Correction**: Identified that debouncing only reduces request frequency and does *not* prevent out-of-order response execution when backend latency fluctuates (e.g. Request A 1200ms vs Request B 200ms). Directed the architecture to combine `AbortController.abort()` on subsequent query dispatches with explicit `activeRequestId` token checks in `useSearchStore.ts`. Designed the `StaleSearchDebugPanel` component so reviewers can toggle and test out-of-order latency.

### 3. Post-Login Routing & Profile Menu Navigation
- **AI Initial Output**: The AI initially routed users directly to the Order Tracking view (`setAccountSection('orders')`) immediately upon completing login or clicking the Demo button in the top navbar.
- **Human Correction**: Corrected the routing lifecycle in `App.tsx` to follow standard e-commerce patterns:
  1. Completing authentication immediately redirects the user to the **Main Shop Page**.
  2. Clicking the **Demo / Profile** button in the header bar opens the **Profile Page Menu** (`setAccountSection('menu')`).
  3. The **Live Order Tracking** view is only launched when explicitly clicking "Track Order" from the post-purchase modal or selecting Orders in the profile menu.

### 4. Checkout Modal Vertical Scrollbar Elimination
- **AI Initial Output**: The initial checkout modal rendered inside a narrow `max-w-md` container with tight row height, causing vertical scrollbars to appear on standard desktop screens.
- **Human Correction**: Updated `BottomSheet.tsx` to support `xl` (`max-w-2xl`) containers. Re-architected `CheckoutModal.tsx` padding, font sizes, and button positioning to fit all delivery choices, payment gateways, promo fields, and tax calculations into a **single, scroll-free card**.

### 5. React Router Non-Usage & Documentation Code Drift
- **AI Initial Output**: The AI left `react-router-dom` declared in `package.json` without using it in `src/`, relying solely on manual state variables. Additionally, code snippets in `DECISIONS.md` contained slight variable name drift from the actual `useSearchStore.ts` and `useCartStore.ts` files, and core dependencies `react` and `react-dom` were omitted from explicit declarations.
- **Human Correction**: 
  1. Wrapped `App.tsx` in `react-router-dom` (`<BrowserRouter>`, `<Routes>`, `<Route>`, `useNavigate`, `useLocation`, `useParams`) to enable real URL deep-linking and browser back navigation.
  2. Updated `DECISIONS.md` code snippets to match `useSearchStore.ts` and `useCartStore.ts` word-for-word.
  3. Explicitly installed `react` and `react-dom` in `package.json`.
  4. Replaced the self-graded evaluation score table in `README.md` with a clean, objective feature implementation matrix.

### 6. Shallow Unit Tests & Storage Warning Remediation
- **AI Initial Output**: Initial unit tests checked trivial state properties without simulating actual out-of-order latency race conditions or mutating catalog data to trigger reconciliation edge cases. Additionally, running tests emitted `nectar_cart_storage` warnings due to a missing DOM environment.
- **Human Correction**: Installed `jsdom` in `vite.config.ts` to silence storage warnings cleanly. Rewrote `searchStore.test.ts` to execute overlapping slow (600ms) vs fast (50ms) queries, and `cartStore.test.ts` to test price shifts, stock capping, and discontinued SKU removal.
