# UI/UX Documentation

Inventix ERP implements a high-density, high-fidelity design philosophy tailored for dense data comprehension. The design system is modeled on premium enterprise solutions (like SAP Fiori or Oracle Redwood) utilizing a custom **"Midnight Slate"** theme.

## 1. Aesthetic Model: "Midnight Slate"

The application uses Tailwind CSS heavily customized for a distraction-free dark mode.
- **Canvas Background:** Deep Slate/Navy (`bg-slate-950` / `#02050c`).
- **Surface Cards:** Translucent or solid dark blue (`bg-[#040815]`) bordered by thin high-density structural separators (`border-slate-900`).
- **Accents:** Indigo (`#6366f1`) for calls-to-actions, active highlights, and brand vector elements.
- **Status Semantic Colors:** 
  - Emerald (`#10b981`) for Verified/In Stock.
  - Amber (`#f59e0b`) for Pending/Low Stock.
  - Rose (`#f43f5e`) for Critical/Out of Stock.

## 2. Typography
- **Primary Font:** `Inter` for standard UI elements (headers, descriptions, table body).
- **Monospace Font:** `JetBrains Mono` for numerical values, SKU Codes, ledger currencies, timestamps, and status badges to ensure perfect vertical alignment in dense grids.

## 3. Core Pages & Navigation

### A. Authentication & Onboarding
- **`LandingPage.tsx`**: Public marketing entry point.
- **`LoginPage.tsx`**: Primary gateway. Features a split-screen layout with form on one side and brand messaging on the other.
- **`RegisterCompanyPage.tsx`**: Multi-step wizard for tenant provisioning.
- **`AcceptInvitationPage.tsx`**: Flow for new employees joining an existing organization.

### B. The Application Shell (`DashboardPage.tsx`)
The shell consists of:
1. **Fixed Sidebar:** Left-rail navigation containing up to 12 specialized organizational modules. Inactive links have a slight hover transition over 220ms with an indigo background glow.
2. **Top Header:** Fixed, backdrop-blurred bar containing the organization context, real-time UTC clock, dynamic alerts bell (slide-out notifications drawer), and the User Profile popover.
3. **Main Content Viewport:** Scrollable central area where the active module renders.

## 4. Reusable Section Modules

The Dashboard orchestrates several primary views:
- **`OverviewSection.tsx`**: KPI scorecards (Total Value, Cost, Orders) and interactive SVG charts (Valuation Trend, Sourcing Spend) that respond to hover states.
- **`ProductsSection.tsx` & `InventorySection.tsx`**: High-density grid views for catalog and stock management.
- **`AIInsightsSection.tsx`**: Predictive analytics interface displaying stockout warnings and alternative supplier recommendations.
- **`PurchaseRequestsSection.tsx` & `PurchaseOrdersSection.tsx`**: Procurement workflows.
- **`VendorsSection.tsx` & `EmployeesSection.tsx`**: Directory management.

## 5. UI Micro-interactions & Polish

### A. Tables (`TableUX.tsx`)
- **Sticky Headers:** Header rows (`th`) lock to the top of the grid viewport on scroll.
- **Hover Highlights:** Rows display a high-contrast background highlight (`bg-indigo-500/5`) on cursor focus.
- **Dynamic Search Highlighting:** Matches in the search bar dynamically wrap matched string segments in a `<mark>` tag with an indigo background inside table cells.
- **Empty States:** Queries returning zero results display a centered `EmptyState` illustration card with a clear secondary action button.

### B. Feedback Systems
- **Skeleton Loaders (`SkeletonLoader.tsx`):** Maintains layout stability during asynchronous data fetching by rendering greyed-out pulsating blocks mirroring the final card sizes.
- **Toasts:** A custom stackable alert system positioned at the top-right. Features spring-physics slide-ins, status-colored borders, and a shrinking time-progress bar.
- **Card Lifting:** Actionable dashboard KPI blocks scale up by `3px` on hover with dynamic shadow depth.
