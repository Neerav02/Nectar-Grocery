<div align="center">

  <img src="public/images/ICON_1.png" alt="Nectar Logo" width="72" height="80" />

  # **Nectar — Production-Grade Online Grocery Platform**

  [![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2%20Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/State-Zustand%20v5.0-764ABC?logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
  [![React Router](https://img.shields.io/badge/Router-React%20Router%20v7.18-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
  [![Vercel Live Demo](https://img.shields.io/badge/Vercel-Live%20Demo-000000?logo=vercel&logoColor=white)](https://nectar-grocery-flax.vercel.app)
  [![Build Status](https://img.shields.io/badge/Build-Passing-53B175)](https://github.com/Neerav02/Nectar-Grocery)

</div>

---

### 🌿 Executive Summary & Application Overview

> **Nectar** is a pixel-perfect, hyper-performant, and production-ready quick-commerce online grocery platform engineered directly from the 28-screen Nectar Grocery Figma design system. Designed to deliver an uncompromising user experience across both mobile viewports and wide-screen desktop displays, Nectar bridges the gap between modern e-commerce UI micro-interactions and complex client-side state resilience. 
> 
> The application features full URL routing via **React Router v6**, a robust asynchronous data layer with variable network latency simulation, advanced stale-search race condition guards via `AbortController` cancellation, and real-time persisted cart synchronization (`validateAndSyncCart`) that dynamically adjusts for catalog price shifts, stock bounds, and discontinued items. Coupled with an interactive 4-step live order tracking dashboard and single-card desktop checkout, Nectar represents a standalone, enterprise-grade frontend architecture.

---

## ✨ Executive Highlights & Feature Capabilities

- 🛣️ **Full React Router Integration**: Deep-linking, shareable URLs, and native browser back/forward navigation across all views (`/`, `/explore`, `/category/:id`, `/product/:id`, `/cart`, `/account`, `/account/orders`).
- 📱 **Mobile-First & Desktop Adapted**: Seamless transformation from mobile bottom-sheet navigation to desktop sticky header navbar (`NavbarDesktop`) with responsive 4-column product grids.
- ⚡ **Engineering Challenge A (Stale Search Guard)**: Built-in `AbortController` cancellation + sequence token validation preventing out-of-order API race conditions with an interactive debug panel.
- 🛒 **Engineering Challenge B (Persisted Cart Resilience)**: Auto-synchronization on mount (`validateAndSyncCart`) protecting against catalog price shifts, out-of-stock bounds, and deleted items without UI crashes.
- 🚚 **Real-Time Live Order Tracking**: Interactive 4-step progress stepper (**Order Placed ➔ Packing ➔ Out for Delivery ➔ Delivered**) with automated 12s status progression timers and delivery partner dispatch details.
- 💳 **Single-Card Desktop Checkout Modal**: Wide `maxWidth="xl"` scroll-free card displaying verified delivery address, express vs standard delivery options, UPI/Card/COD payment gateways, promo codes, and itemized bill breakdown.

---

## 🏛️ System Architecture & Data Flow

The application follows a clean unidirectional data flow architecture powered by modular **Zustand stores**, **React Router v6 navigation**, and a simulated asynchronous API layer with variable latency.

```mermaid
flowchart TD
    subgraph ROUTER ["🛣️ React Router v6 URL Layer"]
        R_SHOP["/ (Shop Page)"]
        R_EXPLORE["/explore (Search & Filters)"]
        R_CAT["/category/:id (Category View)"]
        R_PROD["/product/:id (Product View)"]
        R_CART["/cart (Cart & Checkout)"]
        R_ACC["/account & /account/orders"]
    end

    subgraph UI ["🖥️ UI & View Layer"]
        NAV["Desktop Top Header Navbar"]
        TAB["Mobile Bottom Tab Bar"]
        P_SHOP["Shop Home Page"]
        P_EXPLORE["Explore Categories Page"]
        P_SEARCH["Search & Dynamic Filter Engine"]
        P_CART["Cart Page"]
        P_ACCOUNT["Account & Live Tracking Dashboard"]
        M_CHECKOUT["Single-Card Checkout Modal"]
    end

    subgraph STATE ["⚡ State Management (Zustand Stores)"]
        STORE_CART["useCartStore (Persisted in LocalStorage)"]
        STORE_SEARCH["useSearchStore (AbortController Protection)"]
        STORE_ORDER["useOrderStore (Live Stepper & Status)"]
        STORE_AUTH["useAuthStore (User Session State)"]
        STORE_FILTER["useFilterStore (Draft Filters)"]
        STORE_FAV["useFavoritesStore (Wishlist State)"]
    end

    ROUTER --> UI
    P_SHOP --> NAV & TAB
    P_SEARCH --> STORE_SEARCH
    P_CART --> STORE_CART
    M_CHECKOUT --> STORE_ORDER
```

---

## 🔄 User Workflow & Step-by-Step Lifecycle

```
[ Splash Screen ] (Auto 1.5s Timer -> /splash)
        │
        ▼
[ Onboarding Carousel ] ──(Click "Get Started")──► [ Sign In Welcome Screen (/signin) ]
                                                          │
          ┌───────────────────────────────────────────────┼──────────────────────────────┐
          ▼                                               ▼                              ▼
  [ Mobile OTP Login ]                           [ Continue with Email ]         [ Social Auth (Google/FB) ]
          │                                               │                              │
          ▼                                               ▼                              ▼
  [ OTP Verification ]                           [ Email Login Screen (/login) ] [ Immediate Session Login ]
          │                                               │                              │
          ▼                                               └──────────────┬───────────────┘
  [ Select Location ]                                                    │
          │                                                              ▼
          └───────────────────────────────────────────────► [ Main Shop Page (/) ] ◄────────────┐
                                                                 │                              │
                  ┌──────────────────────────────────────────────┼──────────────────────┐       │
                  ▼                                              ▼                      ▼       │
          [ Browse Banners ]                             [ Search Products ]     [ Filter Categories ]
                  │                                         (/explore)           (/category/:id) │
                  └───────────────────────┬──────────────────────┘                      │
                                          ▼                                             │
                              [ Product Detail View (/product/:id) ]                    │
                                          │                                             │
                                          ▼                                             │
                              [ Add to Cart & Checkout (/cart) ]                        │
                                          │                                             │
                                          ▼                                             │
                             [ Single-Card Checkout Modal ]                             │
                                          │                                             │
                                          ▼                                             │
                             [ Order Success Screen ]                                   │
                                          │                                             │
                                          ▼                                             │
                             [ Profile & Live Tracking (/account/orders) ] ──────────────┘
```

---

## 🛠️ Technology Stack & Dependencies

### Core Frameworks & Tooling
- **Core Library**: React 19.2.8
- **Router Engine**: React Router v7 (`react-router-dom` v7.18.2)
- **Build Engine**: Vite 8.2.2 (Ultra-fast HMR and optimized production bundle)
- **Language**: TypeScript 6.0.2 Strict Mode (100% type safety, zero `any`)
- **Styling**: Tailwind CSS v4.3.3 + Custom Vanilla CSS (Design system, custom scrollbars, animations)
- **State Engine**: Zustand v5.0.15 + `persist` middleware
- **Icons**: Lucide React v1.34.0

---

## ⚡ Engineering Challenges & Technical Solutions

### Challenge A: Stale Search Response Protection
- **Problem**: Out-of-order asynchronous network responses during rapid typing (e.g., Query A `"milk"` with 1200ms delay vs. Query B `"apple"` with 200ms delay). If Query B returns first, Query A's late resolution would overwrite the UI with stale `"milk"` results while the search bar shows `"apple"`.
- **Solution**:
  1. Implemented `AbortController.abort()` to cancel pending requests on new keypresses.
  2. Implemented `activeRequestId` token matching inside `useSearchStore.ts`.
  3. Created an interactive **Stale Search Debug Panel** directly on the Search page, enabling reviewers to trigger race condition tests and toggle protection ON/OFF in real time.

### Challenge B: Persisted Cart Consistency
- **Problem**: Cart items persisted in `localStorage` across reloads may become invalid if product prices, availability, or stock metadata change between browser sessions.
- **Solution**:
  1. On application mount, `validateAndSyncCart()` in `useCartStore.ts` validates saved items against the live product catalog.
  2. Discontinued products are safely removed with user notification toasts.
  3. Price changes automatically update cart subtotals while displaying warning badges (`Price updated from $X to $Y`).
  4. Out-of-stock items automatically cap quantities to available limits without UI crashes.

---

## 🖥️ Desktop Adaptation Strategy

1. **Sticky Desktop Top Navbar (`NavbarDesktop`)**: Replaces the mobile bottom bar on desktop viewports (`≥ 768px`) with logo lockup, location selector, central search bar, section tabs (`Shop`, `Explore`), and badge indicators for Cart (`🛒`) and Favourites (`♡`).
2. **Multi-Column Responsive Product Grid**: Dynamic 2-column (mobile) ➔ 3-column (tablet) ➔ 4-column (desktop) layout within a `max-w-7xl` container.
3. **Single-Card Desktop Checkout Modal (`maxWidth="xl"`)**: Converts mobile bottom sheets into an expanded `max-w-2xl` scroll-free floating card dialog.

---

## 📋 Assignment Feature Implementation Summary

This application implements the core requirements outlined in `Ahoum_Frontend_Developer_Assignment_24h.docx`:

| Assignment Requirement | Implementation Strategy & File Evidence |
| :--- | :--- |
| **28 Mobile Figma Screens Implementation** | Converted 28 mobile screens into clean modular React views with responsive desktop adaptations (`src/pages/`, `src/components/`). |
| **React Router Navigation** | Implemented URL-based routing (`/`, `/explore`, `/category/:id`, `/product/:id`, `/cart`, `/account`) using `react-router-dom` v6 (`src/App.tsx`). |
| **Engineering Challenge A (Stale Search Guard)** | `AbortController` cancellation + `activeRequestId` token guard in `useSearchStore.ts` with telemetry debug panel. |
| **Engineering Challenge B (Cart Consistency)** | `validateAndSyncCart()` in `useCartStore.ts` checking price updates, stock bounds, and discontinued products on mount. |
| **Desktop Adaptation** | Created `NavbarDesktop` header bar (`≥ 768px`), responsive 4-column product grid, and single-card checkout modal (`maxWidth="xl"`). |
| **Engineering Documentation** | Detailed trade-off analysis in `DECISIONS.md`, debugging teardowns in `DEBUGGING.md`, and AI prompt logs in `PROMPT_LOG.md`. |
| **TypeScript Strictness & Clean Build** | Strict mode enabled in `tsconfig.json`, zero `any` usage, verified via `npx tsc --noEmit` and Vite production build (`npm run build`). |

---

## 🌐 Live Vercel Deployment Instructions

### Method 1: Import via Vercel Web Dashboard (Recommended - 1 Minute)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Under **Import Git Repository**, select **`Neerav02/Nectar-Grocery`**.
3. Leave configuration as detected:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will build the project and issue a live URL (`https://nectar-grocery-flax.vercel.app`).

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on `v22.20.0`)
- **npm**: `v9.0.0` or higher (tested on `v11.18.0`)

### Installation Commands

1. **Clone Repository & Navigate:**
   ```bash
   git clone https://github.com/Neerav02/Nectar-Grocery.git
   cd Nectar-Grocery
   ```

2. **Install Project Dependencies:**
   ```bash
   npm install
   ```

3. **Start Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run TypeScript Strict Compiler Verification:**
   ```bash
   npx tsc --noEmit
   ```

5. **Build Production Bundle:**
   ```bash
   npm run build
   ```

---

## 📁 Repository Directory Structure

```
nectar-grocery-app/
├── public/
│   ├── design-references/     # Original Figma reference screenshots (28 screens)
│   ├── images/                # High-definition grocery product & banner assets
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
│   ├── App.tsx                # React Router v6 routing & step execution shell
│   ├── index.css              # Custom styling tokens, fonts & animations
│   └── main.tsx               # Application entry point with BrowserRouter
├── DESIGN_NOTES.md            # Mobile-to-desktop layout adaptation decisions
├── DECISIONS.md               # Architectural trade-off decisions
├── DEBUGGING.md               # Real-world debugging & troubleshooting log
├── PROMPT_LOG.md              # AI prompt supervision record & human corrections
├── vercel.json                # Vercel SPA routing configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📑 Required Assignment Documentation

- [`DESIGN_NOTES.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DESIGN_NOTES.md): 3 desktop layout adaptation decisions and responsive rationale.
- [`DECISIONS.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DECISIONS.md): 3 architectural trade-offs including stale search protection and cart resilience.
- [`PROMPT_LOG.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/PROMPT_LOG.md): AI prompt log and human supervision corrections (Figma copy typos & async race condition guards).
- [`DEBUGGING.md`](file:///d:/Ahoum%20Labs/nectar-grocery-app/DEBUGGING.md): Real troubleshooting logs (TypeScript CSS side-effect imports & Vite HTML script entry resolution).
