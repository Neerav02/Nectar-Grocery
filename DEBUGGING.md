# 🐞 Nectar Grocery App — Comprehensive Debugging & Troubleshooting Log

This document records real engineering issues, unexpected build errors, state synchronization bugs, and layout anomalies encountered during the development and testing of the Nectar Grocery web application.

---

## 📌 Issue Summary Matrix

| Issue ID | Category | Symptom | Root Cause | Fix Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **BUG-01** | TypeScript | `TS2882: Cannot find module './index.css'` | Missing Vite environment type definitions in `tsconfig.json`. | Created `src/vite-env.d.ts` and added `"types": ["vite/client"]`. | ✅ Resolved |
| **BUG-02** | Vite Build | Build failed resolving `/src/main.ts` from `index.html`. | Legacy HTML script entry reference pointing to `.ts` instead of `.tsx`. | Updated `index.html` entry script source to `/src/main.tsx`. | ✅ Resolved |
| **BUG-03** | UI / Layout | Checkout modal displaying vertical scrollbars on desktop. | `BottomSheet` max-width restricted to `md` (~448px) with tight padding. | Extended `BottomSheet` max-width variants to `xl` (~672px) and refactored card grid. | ✅ Resolved |
| **BUG-04** | Navigation | Post-login redirecting to tracking page instead of main shop. | `accountSection` state remaining set to `'orders'` after order placement. | Reset `accountSection` to `'menu'` on login and set `activeTab` to `'shop'`. | ✅ Resolved |
| **BUG-05** | Deployment | Direct URL refreshes (`/cart`, `/explore`) returning Vercel 404. | Vercel static server searching for file paths on disk instead of SPA routing. | Added `vercel.json` with wild-card rewrite rules (`"source": "/(.*)", "destination": "/index.html"`). | ✅ Resolved |

---

## 🔍 Detailed Issue Teardowns & Fix Verifications

### 1. Issue BUG-01: TypeScript Side-Effect CSS Import Error (`TS2882`)

#### Symptom:
Executing `npx tsc --noEmit` threw the following compilation error:
```bash
src/main.tsx(4,8): error TS2882: Cannot find module or type declarations for side-effect import of './index.css'.
```

#### Diagnosis:
TypeScript operating in strict mode was unable to resolve CSS side-effect imports (`import './index.css'`) because Vite's ambient type definitions were missing from the compiler configuration.

#### Fix Applied:
1. Created `src/vite-env.d.ts`:
   ```typescript
   /// <reference types="vite/client" />
   ```
2. Added `"types": ["vite/client"]` to `tsconfig.json` compiler options.

---

### 2. Issue BUG-02: Vite HTML Script Entry Path Mismatch

#### Symptom:
Running `npm run build` failed with the following Vite bundle error:
```bash
[vite]: Could not resolve entry module "src/main.ts".
```

#### Diagnosis:
The `index.html` entry file contained `<script type="module" src="/src/main.ts"></script>`, pointing to a non-existent `.ts` file instead of the React TypeScript JSX entry point `/src/main.tsx`.

#### Fix Applied:
Updated `index.html` entry script reference:
```html
<script type="module" src="/src/main.tsx"></script>
```

---

### 3. Issue BUG-03: Desktop Checkout Modal Scrollbar Artifacts

#### Symptom:
On desktop displays (`≥ 768px`), opening the Checkout Modal rendered vertical scrollbars inside the dialog container.

#### Diagnosis:
The base `BottomSheet` component restricted maximum width to `max-w-md` (~448px), compressing the checkout row height and forcing browser overflow scrolling.

#### Fix Applied:
1. Updated `BottomSheet.tsx` to support `xl` (`max-w-2xl`) container variants.
2. Formatted `CheckoutModal.tsx` into a spacious single-card layout with optimized row margins.

---

### 4. Issue BUG-04: Post-Login Redirection State Glitch

#### Symptom:
Completing user authentication or clicking "Demo Profile" navigated directly to the Order Tracking stepper screen instead of the Shop Home page.

#### Diagnosis:
`accountSection` in store state persisted as `'orders'` from prior order placement cycles.

#### Fix Applied:
Updated `App.tsx` navigation handlers to explicitly reset `accountSection` to `'menu'` and set `activeTab` to `'shop'` upon successful login.

---

### 5. Issue BUG-05: Vercel Single-Page Application 404 Deep Link Refresh

#### Symptom:
Navigating to deep routes like `https://nectar-grocery-flax.vercel.app/cart` or `https://nectar-grocery-flax.vercel.app/explore` directly via browser refresh produced a Vercel 404 Not Found error.

#### Diagnosis:
Vercel's edge network searched for static HTML files located at `/cart/index.html` or `/explore/index.html` on the server disk instead of routing all HTTP traffic through Vite's root `/index.html` single-page application router.

#### Fix Applied:
Created `vercel.json` with SPA wildcard rewrite rules:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Verification:
Refreshed deep URLs directly on Vercel preview builds; verified 100% route hydration with zero 404 errors.
