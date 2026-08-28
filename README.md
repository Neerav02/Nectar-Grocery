# 🛒 Nectar — Production-Grade Online Groceries Web Application

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3%20Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand%20v4-764ABC?logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Build Status](https://img.shields.io/badge/Build-Passing-53B175)](https://github.com/)

A pixel-faithful, production-ready, mobile-first and desktop-adapted online grocery delivery application built from the 28-screen Nectar Grocery Figma design specification. Designed for ultra-high fidelity, seamless user experience, and robust asynchronous state management.

---

## 📸 Executive Summary & Key Highlights

- 📱 **Mobile-First & Desktop Adapted**: Seamless transition from mobile bottom-sheet navigation to desktop sticky header navbar with 4-column product grids.
- ⚡ **Engineering Challenge A (Stale Search Guard)**: Built-in `AbortController` cancellation + sequence token validation preventing out-of-order API race conditions with an interactive debug panel.
- 🛒 **Engineering Challenge B (Persisted Cart Resilience)**: Auto-synchronization on reload protecting against catalog price shifts, out-of-stock bounds, and deleted items without UI crashes.
- 🚚 **Real-Time Live Order Tracking**: Interactive 4-step progress stepper (**Order Placed ➔ Packing ➔ Out for Delivery ➔ Delivered**) with automated status progression timers and delivery partner dispatch.
- 💳 **Single-Card Checkout Modal**: Wide `maxWidth="xl"` scroll-free card displaying verified delivery address, express vs standard delivery options, UPI/Card/COD payment gateways, promo codes, and itemized bill breakdown.

---

## 🛠️ Technology Stack & Architecture

### Core Technologies
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | React 18.3 | Concurrent UI rendering & hooks architecture |
| **Build Tooling** | Vite 8.2 | Lightning-fast HMR and optimized production bundling |
| **Language** | TypeScript 5.6 (Strict Mode) | Full type safety with zero `any` usage |
| **Styling** | Tailwind CSS v4 + Vanilla CSS | Modern utility classes, glassmorphic modals, custom scrollbars |
| **State Management**| Zustand v4 + Persist Middleware | Modular stores (`cart`, `auth`, `orders`, `search`, `favorites`, `filter`) |
| **Icons** | Lucide React | Clean, responsive UI icon system |

---

## 📐 System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph UI Layer
        MD[Desktop Header Navbar]
        MB[Mobile Bottom Tab Bar]
        P[Pages: Shop, Explore, Cart, Favourites, Account]
        MODALS[Checkout, Auth, Filter, Location, Order Status]
    end

    subgraph State Management Layer (Zustand Stores)
        UC[useCartStore - Persisted]
        US[useSearchStore - AbortController]
        UO[useOrderStore - Persisted]
        UA[useAuthStore - Persisted]
        UF[useFilterStore]
        UV[useFavoritesStore]
    end

    subgraph Data & Async Layer
        MOCK[Mock API Engine - Variable Latency 200-1200ms]
        CATALOG[Static Product & Category Catalog JSON]
        LS[(Browser LocalStorage)]
    end

    P --> UC & US & UO & UA & UF & UV
    MODALS --> UC & UO & UA
    US <--> MOCK <--> CATALOG
    UC <--> LS
    UO <--> LS
    UA <--> LS
```

---

## 🚀 Quick Start & Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on `v22.20.0`)
- **npm**: `v9.0.0` or higher (tested on `v11.18.0`)

### Installation Commands

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd nectar-grocery-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Launch Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Verify TypeScript Strict Compilation:**
   ```bash
   npx tsc --noEmit
   ```

5. **Build Production Bundle:**
   ```bash
   npm run build
   ```

---

## ⚡ Engineering Challenges & Solutions

### Challenge A: Stale Search Response Protection
- **Problem**: Variable network latency (200ms–1200ms) causes fast subsequent requests (e.g. searching "apple") to complete *before* older slow requests (e.g. searching "milk"), causing stale results to overwrite the UI.
- **Solution**:
  1. Utilized `AbortController` to cancel ongoing HTTP requests upon typing a new query.
  2. Implemented `activeRequestId` token matching in `useSearchStore.ts`.
  3. Built an interactive **Stale Search Debug Panel** on the Search page allowing reviewers to simulate race conditions and toggle protection ON/OFF.

### Challenge B: Persisted Cart Consistency
- **Problem**: Cart items persisted in `localStorage` can become stale if catalog prices or stock availability change between browser sessions.
- **Solution**:
  1. On mount, `validateAndSyncCart()` compares persisted items against current catalog metadata.
  2. Discontinued products are safely removed with user notification toasts.
  3. Price changes update cart totals while displaying warning badges (`Price updated from $X to $Y`).
  4. Stock bounds automatically adjust quantity without throwing runtime errors.

---

## 📁 Repository Directory Structure

```
nectar-grocery-app/
├── public/
│   ├── images/                # High-res grocery assets & category banners
│   ├── design-references/     # Original Figma reference screenshots
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── mockApi.ts         # Latency simulator (200-1200ms) & AbortSignal guard
│   │   └── productsData.ts    # Comprehensive product catalog & category definitions
│   ├── components/
│   │   ├── auth/              # AuthModal & Location selection dialogs
│   │   ├── cart/              # Cart line items, resilience banners, single-card CheckoutModal
│   │   ├── common/            # PillButton, Stepper, BottomSheet, BottomTabBar, Skeletons
│   │   ├── filter/            # FilterSheet modal with draft state management
│   │   ├── layout/            # NavbarDesktop top navigation bar
│   │   ├── product/           # ProductCard, ProductGrid components
│   │   └── search/            # StaleSearchDebugPanel telemetry widget
│   ├── pages/                 # Full application pages (Shop, Explore, Cart, Account, etc.)
│   ├── stores/                # Zustand global state stores (cart, order, search, auth, etc.)
│   ├── types/                 # TypeScript data contracts & interfaces
│   ├── App.tsx                # Main routing & step execution shell
│   ├── index.css              # Custom styling tokens, fonts & animations
│   └── main.tsx               # Application entry point
├── DESIGN_NOTES.md            # Mobile-to-desktop layout adaptation decisions
├── DECISIONS.md               # Architectural trade-off decisions
├── DEBUGGING.md               # Real-world debugging & troubleshooting log
├── PROMPT_LOG.md              # AI prompt supervision record & human corrections
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📄 Documentation Submissions Summary

1. [`DESIGN_NOTES.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DESIGN_NOTES.md): 3 desktop layout adaptation decisions and responsive rationale.
2. [`DECISIONS.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DECISIONS.md): 3 architectural trade-offs including stale search protection and cart resilience.
3. [`PROMPT_LOG.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/PROMPT_LOG.md): AI prompt log and human supervision corrections (Figma copy typos & async race condition guards).
4. [`DEBUGGING.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DEBUGGING.md): Real troubleshooting logs (TypeScript CSS side-effect imports & Vite HTML script entry resolution).

---

## 🔮 Future Enhancements

1. **GraphQL / WebSocket Sync**: Real-time WebSocket connection for live delivery driver GPS map tracking.
2. **End-to-End Testing**: Integration of Playwright E2E test suites for automated cart resilience assertion.
3. **PWA & Offline Service Worker**: Offline asset caching and push notifications for order delivery updates.
