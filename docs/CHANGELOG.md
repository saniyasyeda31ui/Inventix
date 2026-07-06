# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enterprise Role-Based Access Control (RBAC) engine (`src/lib/rbac.ts`) mapping 6 distinct application roles (`admin`, `procurement_manager`, `inventory_manager`, `warehouse_manager`, `finance_manager`, `viewer`).
- Role-based dashboard UI enforcing permission checks for module visibility and action buttons.
- User Management module (`UserManagementSection.tsx`) for administrators to view and invite employees.
- Supabase Edge Function (`provision-user`) to securely create user accounts and bypass client-side signup limits.
- Accept Invitation flow (`AcceptInvitationPage.tsx`) for newly provisioned employees to set their passwords.
- Dashboard metrics aggregation system (`useDashboardMetrics.ts`) for real-time KPI scorecards.
- Comprehensive technical documentation in the `docs/` folder (API, Database Schema, Project Context, UI, Deployment, RBAC, Changelog).
- SendGrid integration and custom SMTP configuration via Supabase Auth email templates.
- Global `ErrorBoundary.tsx` wrapper for graceful failure handling in React components.
- `20260705000000_update_profile_roles.sql` database migration for standardizing user roles.

### Changed
- Converted remaining UI modules to utilize live Supabase custom hooks instead of local mock data arrays.
- Refined `TableUX` highlighting and `SkeletonLoader` bounds for improved performance and layout stability.

### Fixed
- Role evaluation logic fallback mapping to prevent unauthenticated access.
- React Router warning during AuthContext redirection flows.

---

## [1.2.0] - 2026-07-02

### Added
- Full Notifications integration (`useNotifications.ts`) bound to the real-time Dashboard alerts drawer.
- AI Recommendations logic (`useAIRecommendations.ts`) enabling role-based execution of predictive stockout responses.
- Complete suite of Supabase CRUD hooks: `useEmployees`, `useInventory`, `usePayments`, `usePurchaseOrders`, `usePurchaseRequests`, `useReports`, and `useWarehouses`.

### Changed
- Transitioned `EmployeesSection`, `InventorySection`, `PaymentsSection`, `PurchaseOrdersSection`, `PurchaseRequestsSection`, `ReportsSection`, and `WarehousesSection` to consume Supabase hooks natively.
- Minor refactors to `dashboardData.ts` to accommodate the transition phase.

---

## [1.1.0] - 2026-07-01

### Added
- Phase 3: Supabase Integration framework.
- Core PostgreSQL database schema `20260630000000_init_schema.sql` defining 15 tables and strict Row-Level Security (RLS) policies.
- Global `AuthContext` to sync the Supabase JWT session with the React frontend tree.
- `RouteGuard` component to secure authenticated routes and automatically route unauthenticated traffic.
- Initial backend hooks: `useProducts.ts` and `useVendors.ts`.

### Changed
- Refactored `App.tsx` and `LoginPage.tsx` to handle true authentication logic replacing local state mockups.
- Migrated the Products and Vendors modules from prototypes to live database layers.

---

## [1.0.0] - 2026-07-01

### Added
- Initial project setup using React 19, Vite, Tailwind CSS v4, and TypeScript.
- Custom "Midnight Slate" enterprise design system (`index.css` and Tailwind config).
- Public-facing Landing Page (Hero, Features, How It Works, Pricing, FAQ).
- High-density ERP Dashboard UI with collapsible navigation, real-time UTC clock header, and tab-based routing.
- Initial front-end prototypes for Products, Inventory, Warehouses, Vendors, Purchase Requests, Purchase Orders, Payments, Employees, Reports, AI Insights, and Settings.
- Custom UI micro-interactions: stackable Toast system, animated Table rows (`TableUX.tsx`), and SVG data visualizations.
- `dashboardData.ts` stub file for mock interface population.
- Product Requirements Document (`PRD.md`) and Design Specifications (`design.md`).
