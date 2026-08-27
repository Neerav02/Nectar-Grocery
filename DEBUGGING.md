# Nectar Grocery App — Debugging & Troubleshooting Log

This document records real engineering issues, unexpected bugs, and exposed assumptions encountered during the development and testing of the application.

---

## Issue 1: TypeScript Side-Effect CSS Import Error (`TS2882`)

- **Symptom:** Running `npx tsc --noEmit` threw a compiler error:
  `src/main.tsx(4,8): error TS2882: Cannot find module or type declarations for side-effect import of './index.css'.`
- **Diagnosis:** TypeScript in strict mode was unable to resolve CSS file imports (`import './index.css'`) because default Vite environment type declarations were not registered.
- **Root Cause:** The project `tsconfig.json` lacked a `"types": ["vite/client"]` entry, and `src/vite-env.d.ts` was not present in the initial scaffold.
- **Fix Applied:**
  1. Created `src/vite-env.d.ts` containing `/// <reference types="vite/client" />`.
  2. Updated `tsconfig.json` to include `"types": ["vite/client"]`.
- **Verification:** Re-ran `npx tsc --noEmit`, confirming zero TypeScript errors across all 18+ component modules.

---

## Issue 2: Vite Production Build Script Misalignment (`/src/main.ts` vs `/src/main.tsx`)

- **Symptom:** Executing `npm run build` failed with `[plugin vite:build-html] Error: Failed to resolve /src/main.ts from index.html`.
- **Diagnosis:** The HTML entry point `index.html` attempted to import `/src/main.ts`, which had been replaced with `/src/main.tsx` during React TypeScript refactoring.
- **Root Cause:** Standard Vite React template initialization left behind a legacy `index.html` script reference pointing to `.ts` instead of `.tsx`.
- **Fix Applied:**
  1. Updated `index.html` script source: `<script type="module" src="/src/main.tsx"></script>`.
  2. Installed missing devDependencies `@types/react`, `@types/react-dom`, and `@vitejs/plugin-react`.
  3. Corrected `index.html` root element ID to `<div id="root"></div>`.
- **Verification:** Executed `npm run build`, generating a clean, optimized `dist/` bundle (HTML, CSS, JS) with 0 errors.
