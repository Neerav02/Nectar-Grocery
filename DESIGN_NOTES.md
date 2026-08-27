# Nectar Grocery App — Design Notes: Mobile-to-Desktop Adaptations

This document outlines the key responsive architectural decisions made when scaling the mobile-first Nectar Figma design up to desktop viewports. Rather than stretching a narrow mobile layout, the desktop experience has been designed as a responsive web application.

---

## 1. Top Navigation Bar vs. Bottom Mobile Navigation Bar

- **Mobile Pattern:** A 5-tab persistent bottom bar (`Shop`, `Explore`, `Cart`, `Favourite`, `Account`) pinned to the bottom of the viewport with safe-area spacing and live cart badge count.
- **Desktop Adaptation:** Replaced the bottom tab bar on viewports `≥ 768px` (`md:block`) with a sticky top application header (`NavbarDesktop`).
- **Design Rationale:** Bottom navigation bars on desktop force long cursor travel to the bottom of large displays and feel unnatural for mouse/keyboard navigation. The top header integrates:
  - Nectar brand lockup (carrot logo + wordmark).
  - Quick-access location selector pill ("Block C, Dhaka").
  - Centralized global search bar.
  - Horizontally aligned section tabs (`Shop`, `Explore`, `Cart`, `Favourites`).
  - Right-aligned quick-action icons (Favorites count, Cart count, Profile/Login status).

---

## 2. Dynamic Product Grid (2-Column Mobile → 4-Column Desktop)

- **Mobile Pattern:** 2-column grid (`grid-cols-2`) with 16px padding and compact product cards to maximize screen real estate on mobile devices.
- **Desktop Adaptation:** Responsive multi-column layout (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`) within a centered `max-w-7xl` container.
- **Design Rationale:** A 2-column layout on desktop monitors creates oversized, awkward cards with excessive white space. Scaling to a 4-column grid preserves optimal card proportions (~240px width), maintains visual balance, allows users to scan 12+ items above the fold without scrolling, and prevents awkward stretching.

---

## 3. Desktop Modal & Sheet Layout Alignment

- **Mobile Pattern:** Full-bleed slide-up bottom sheets (`animate-slide-up`) covering 90% of the screen height for Filters, Location Selector, Checkout, and Order Results.
- **Desktop Adaptation:** Floating centered dialog containers (`sm:rounded-3xl max-w-lg shadow-2xl animate-fade-in`) with semi-transparent backdrop blur (`backdrop-blur-xs`).
- **Design Rationale:** Bottom sheets anchored to the bottom edge look unnatural on wide desktop viewports. Centering the sheet as an elevated modal dialog keeps user focus centered, maintains consistent ergonomics, and leverages keyboard shortcuts (`Escape` key listener) for rapid dismissal.
