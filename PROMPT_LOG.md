# Nectar Grocery App — AI Prompt Log & Supervision Record

This document records the material AI interactions, prompts, architectural supervision, and manual corrections made during the development of the Nectar Grocery App.

---

## AI Execution & Interaction Record

| Prompt ID | AI Model / Tool | Prompt Purpose | Action Taken & Decision | Verification Method |
|---|---|---|---|---|
| **P-01** | Gemini 3.6 Flash / Antigravity | Project Architecture & Tech Stack Setup | Approved Vite + React 18 + TypeScript (strict mode) + Tailwind CSS + Zustand + Lucide Icons setup. | Ran `npm run build` & verified zero lint/type errors. |
| **P-02** | Gemini 3.6 Flash / Antigravity | Figma Teardown & Component Extraction | Parsed 28 Figma screens from `Frontend Grocery App Test.zip`. Mapped identity tokens, colors (`#53B175`), fonts (Sen), and component boundaries. | Cross-referenced against exported screenshots in `public/design-references`. |
| **P-03** | Gemini 3.6 Flash / Antigravity | Stale Search Protection (Challenge A) | Built `useSearchStore.ts` using `AbortController` and `activeRequestId` token checks to prevent race conditions. | Tested using the built-in Stale Search Debug Panel ("milk" vs "apple" test). |
| **P-04** | Gemini 3.6 Flash / Antigravity | Persisted Cart Resilience (Challenge B) | Built `useCartStore.ts` with `validateAndSyncCart()` to handle price updates, stock limits, and deleted products. | Verified persistent state in `localStorage` across page reloads. |

---

## What AI Got Wrong / What I Corrected

### 1. Copy Fixes & Figma Typo Remediation
- **AI Initial Output:** AI initially transcribed raw copy directly from the original Figma design kit, including obvious typos such as `"online groceriet"` (tagline), `"Loging"` (header), `"Sing Up"` (button label), `"Pament"` (checkout row), and `"Something went tembly wrong"` (failure modal).
- **Human Correction:** Applied systematic copy remediation across all views and constants. Cleaned up copy to production standards (`"online groceries"`, `"Log In"`, `"Sign Up"`, `"Payment"`, `"Something went terribly wrong"`) while keeping brand identity intact.

### 2. Async Search Race Condition Solution
- **AI Initial Output:** AI initially proposed standard `useDebounce` hook for live search inputs, assuming debouncing alone resolves stale responses.
- **Human Correction:** Identified that debouncing only delays request invocation and does *not* prevent out-of-order response execution when backend latency fluctuates (e.g. Request A 1200ms vs Request B 200ms). Corrected the architecture to use `AbortController.abort()` on subsequent query dispatches combined with explicit `requestId` validation in `useSearchStore.ts`. Designed an interactive **Stale Search Debug Panel** to allow reviewers to trigger and verify out-of-order behavior.
