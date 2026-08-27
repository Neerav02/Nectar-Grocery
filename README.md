# Nectar — Online Groceries (React + TypeScript Application)

A pixel-faithful, responsive React web application built from the 28-screen Nectar Grocery Figma design specification. Powered by React 18, Vite, TypeScript strict mode, Tailwind CSS v4, Zustand global state management, and custom UI components.

---

## 🚀 Quick Start & Local Run Instructions

### Prerequisites
- Node.js `v18.0.0` or higher (tested on `v22.20.0`)
- npm `v9.0.0` or higher (tested on `v11.18.0`)

### Installation & Run Steps

1. **Navigate to the project directory:**
   ```bash
   cd "d:/Ahoum Labs/nectar-grocery-app"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run TypeScript type check:**
   ```bash
   npx tsc --noEmit
   ```

5. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 🎨 Key Features & Figma Teardown Implementation

- **Splash & Onboarding:** Timed splash screen + lifestyle onboarding screen with CTA.
- **Home Tab ("Shop"):** Location picker, search bar, auto-rotating promo banner carousel, Exclusive Offers row, Best Selling row, and pastel category tiles.
- **Explore Tab ("Find Products"):** 2-column pastel category tiles grid with matching hue borders (`#EEF8F2`, `#FFF6EE`, `#FDE8E4`, `#F4EBF7`, `#FEF8E5`, `#EDF7FC`).
- **Category Listing Page:** Filterable 2-column product grid with custom filter sheet trigger.
- **Search & Live Search:** Instant debounced product search with filter modal integration.
- **Product Detail View:** Photo stage with carousel pagination dots, favorite toggle, unit price, quantity stepper, expandable accordion rows (Detail, Nutritions, Review), and sticky "Add To Basket" button.
- **My Cart Page:** Cart line items with steppers, remove actions, resilience alerts, and sticky "Go to Checkout" pill with running total badge.
- **Favourites Page:** Persistent favorite items list with "Add All To Cart" CTA.
- **Checkout & Order Result Modals:**
  - Checkout bottom sheet with payment/delivery options and order failure toggle.
  - Celebration Order Success screen with confetti particles.
  - Order Failure screen with retry action.
- **Auth & Location Modals:** Support for Login, Signup, Phone/OTP, and Zone/Area location picker.

---

## ⚡ Engineering Challenges

### Challenge A: Stale Search Response Protection
- **Problem:** Out-of-order API responses where slow request A overwrites fast request B.
- **Solution:** Implemented `AbortController` cancellation alongside `activeRequestId` token validation in `useSearchStore.ts`.
- **Demo / Debug Mode:** An interactive **Stale Search Debug Panel** is embedded directly on the Search page. Reviewers can click "Trigger Race Condition Test ('milk' vs 'apple')" and toggle protection ON/OFF to inspect live execution telemetry.

### Challenge B: Persisted Cart Consistency
- **Problem:** Stale cart state stored in `localStorage` across reloads when catalog data changes.
- **Solution:** On mount, `validateAndSyncCart()` in `useCartStore.ts` checks persisted items against latest catalog:
  - Discontinued products are safely removed with user notification.
  - Price changes automatically update cart subtotals while displaying comparative warning badges (`Price updated from $X to $Y`).
  - Stock limits cap item quantity to maximum available stock.

---

## 🖥️ Desktop Adaptation Strategy

- **Sticky Desktop Top Navbar (`NavbarDesktop`):** Replaces the mobile bottom bar on desktop (`≥ 768px`) with logo, location selector, central search, horizontal nav tabs, favorites badge, cart badge, and user profile button.
- **Multi-Column Product Grid:** Dynamic 2-col (mobile) → 3-col (tablet) → 4-col (desktop) grid layout within a `max-w-7xl` container.
- **Floating Modal Dialogs:** Converts mobile bottom sheets into centered backdrop-blurred modal dialogs (`sm:rounded-3xl`).

---

## 📁 Repository Structure

```
nectar-grocery-app/
├── public/
│   ├── design-references/     # Original Figma reference screenshots
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── mockApi.ts         # Latency simulation (200-1200ms) & AbortSignal support
│   │   └── productsData.ts    # Mock grocery catalog & categories
│   ├── components/
│   │   ├── auth/              # Auth & Location modals
│   │   ├── cart/              # Cart item, resilience alerts, checkout modals
│   │   ├── common/            # PillButton, Stepper, BottomSheet, BottomTabBar, Skeletons
│   │   ├── filter/            # Filter sheet modal with draft state
│   │   ├── layout/            # NavbarDesktop header
│   │   ├── product/           # ProductCard, ProductGrid
│   │   └── search/            # StaleSearchDebugPanel
│   ├── pages/                 # Splash, Onboarding, Home, Explore, Category, Detail, Cart, Favourites, Account
│   ├── stores/                # Zustand stores (cart, search, favorites, filter, auth)
│   ├── types/                 # TypeScript data contracts
│   ├── App.tsx
│   ├── index.css              # Color tokens, fonts, animations
│   └── main.tsx
├── DESIGN_NOTES.md            # Mobile-to-desktop adaptation decisions
├── DECISIONS.md               # Architectural decisions & trade-offs
├── DEBUGGING.md               # Debugging & troubleshooting log
├── PROMPT_LOG.md              # AI prompt log & human corrections
└── README.md
```

---

## 🔮 What I Would Improve With Another Day

1. **E2E Testing Suite:** Add Playwright tests verifying stale search aborts and cart persistence under simulated price shifts.
2. **Server-Side Rendering (SSR):** Migrate layout to Next.js App Router for dynamic SSR product detail pages and enhanced SEO indexing.
3. **PWA Offline Support:** Add service worker caching for offline mobile web support.
