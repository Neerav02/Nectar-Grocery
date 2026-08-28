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

#### Root Cause:
The scaffolded `tsconfig.json` lacked a `"types": ["vite/client"]` declaration, and `src/vite-env.d.ts` was omitted from the initial project setup.

#### Fix Applied:
1. Created `src/vite-env.d.ts`:
   ```typescript
   /// <reference types="vite/client" />
   ```
2. Updated `tsconfig.json` compiler options:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "types": ["vite/client"],
       "strict": true
     }
   }
   ```

#### Verification:
Re-ran `npx tsc --noEmit` and confirmed **0 TypeScript compiler errors** across all 18+ component modules.

---

### 2. Issue BUG-02: Vite Production Build HTML Entry Misalignment

#### Symptom:
Executing `npm run build` failed during Vite HTML transformation with:
```bash
[plugin vite:build-html] Error: Failed to resolve /src/main.ts from index.html
```

#### Diagnosis:
The main HTML entry point `index.html` attempted to import `/src/main.ts`, which had been converted to `/src/main.tsx` during React TypeScript refactoring.

#### Root Cause:
Standard Vite template initialization left behind an un-updated script tag referencing `.ts` instead of `.tsx`.

#### Fix Applied:
Updated `index.html` entry script source tag:
```diff
- <script type="module" src="/src/main.ts"></script>
+ <script type="module" src="/src/main.tsx"></script>
```

#### Verification:
Executed `npm run build`, producing an optimized production bundle in `dist/` in 659ms with zero build errors.

---

### 3. Issue BUG-03: Checkout Modal Vertical Scrollbar Overflow on Desktop

#### Symptom:
On standard desktop viewports (`1280px x 800px`), the Checkout modal displayed internal vertical scrollbars, obscuring payment methods and forcing users to scroll down to click the **Place Order** button.

#### Diagnosis:
The modal container was constrained to `max-w-md` (~448px width). Combined with tight internal vertical margins, the total height exceeded the available modal viewport space.

#### Root Cause:
`BottomSheet.tsx` max-width class mapping only supported options up to `lg`. `CheckoutModal.tsx` lacked horizontal breathing room to stack payment items side-by-side.

#### Fix Applied:
1. Extended `BottomSheet.tsx` `maxWidthClasses` mapping:
   ```typescript
   const maxWidthClasses = {
     sm: 'max-w-sm',
     md: 'max-w-md',
     lg: 'max-w-lg',
     xl: 'max-w-2xl',
     '2xl': 'max-w-4xl',
   };
   ```
2. Updated `CheckoutModal.tsx` container to use `maxWidth="xl"`:
   ```tsx
   <BottomSheet isOpen={isOpen} onClose={onClose} title="Checkout" maxWidth="xl">
     <div className="flex flex-col gap-4 py-1">
       {/* Single-card itemized layout */}
     </div>
   </BottomSheet>
   ```

#### Verification:
Opened checkout modal on `1280px` display; confirmed all charges, payment methods, delivery speeds, and CTA fit comfortably in **one spacious card with ZERO vertical scrollbars**.

---

### 4. Issue BUG-04: Post-Login Navigation Redirection Loop

#### Symptom:
After placing an order and logging in, subsequent clicks on the **Demo / Profile** button in the header navbar redirected the user directly back to the Live Order Tracking screen instead of the main Profile menu.

#### Diagnosis:
The `accountSection` state in `App.tsx` remained set to `'orders'` from the previous post-purchase tracking trigger.

#### Root Cause:
`handleTabChange('account')` updated `activeTab` to `'account'` without resetting `accountSection` back to `'menu'`.

#### Fix Applied:
Updated `App.tsx` login and tab change handlers:
```typescript
const handleCompleteAuthSequence = () => {
  login('user@nectar.com', 'Demo Customer');
  setCompletedOnboarding(true);
  setAccountSection('menu');
  setActiveTab('shop'); // Land directly on Shop page after login
  setCurrentStep('main_app');
};

const handleTabChange = (tab: TabType) => {
  if (tab === 'account') {
    setAccountSection('menu'); // Always open Profile Menu when clicking Profile button
  }
  setActiveTab(tab);
  setSelectedCategory(null);
  setSelectedProduct(null);
};
```

#### Verification:
Logged in via Demo Login ➔ Verified app lands directly on **Shop Page**. Clicked **Demo** in top navbar ➔ Verified app opens directly to the **Profile Page Menu**.
