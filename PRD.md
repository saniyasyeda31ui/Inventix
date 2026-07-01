# Product Requirements Document (PRD)
## Project: Inventix ERP Dashboard
**Author:** AI Sourcing & Core Development Team  
**Status:** Approved / Ready for Backend Integration  
**Date:** June 30, 2026

---

## 1. Executive Summary & Product Vision
**Inventix ERP** is a high-fidelity, high-density enterprise resource planning (ERP) dashboard built for lead sourcing administrators, procurement managers, and logistics specialists. Designed with a sleek, distraction-free "Midnight Slate" dark aesthetic, it balances complex data operations with premium micro-interactions. 

The goal of the current system is to transition from a highly responsive, rich frontend prototype to a secure, cloud-hosted, database-backed application. By utilizing **Supabase** (PostgreSQL database, real-time subscriptions, Supabase Auth, and Storage), Inventix will achieve secure multi-user collaboration, real-time telemetry updates, durable audit-compliant activity logging, and role-based permissions.

---

## 2. Target Audience & Personas
*   **Alexander S. (Lead Sourcing Admin):** Oversees the procurement pipeline, reviews seasonal demand forecasts, shifts reorder thresholds, and approves pending purchase orders.
*   **Logistics Coordinator:** Monitors warehouse capacity, manages stock inflows/outflows, and updates physical SKU placements.
*   **Financial Auditor:** Audits monthly procurement expenditures, assesses vendor price metrics, and validates payment ledger balances.

---

## 3. Product Architecture & Technical Stack
The system is divided into a robust, modular client application and a proposed PostgreSQL-powered server layer via Supabase.

*   **Frontend Framework:** React 18+ (TypeScript), Vite (for rapid compilation and static builds).
*   **Animation Engine:** `motion` (GPU-accelerated layout and page transitions).
*   **Styling & Design System:** Tailwind CSS with a cohesive, professional "Midnight/Slate" theme (SAP/Oracle style enterprise utility).
*   **Data Visualization:** Custom inline interactive SVGs (vector line plots and animated bar charts).
*   **Planned Backend Integration:** Supabase (Client-side JS/TS SDK v2)
    *   **Authentication:** JWT-based secure email logins, session tokens, and metadata claims.
    *   **Database:** PostgreSQL with Row-Level Security (RLS) enabled.
    *   **Real-time:** Real-time listeners for instant chat, activity logs, and stock status shifts.
    *   **Storage:** Supabase Storage buckets for product images and generated PDF reports.

---

## 4. Current Frontend Modules & User Flows

### A. Core Navigation & Layout (`DashboardPage.tsx`)
*   **Collapsible Sidebar:** Access to 12 specialized organizational modules.
*   **Enterprise Top Header:** Integrates live workspace syncing status, dynamic UTC clock, responsive theme-mode triggers, real-time alerts drawer, and a profile dropdown.
*   **Smooth Page Transitions:** Page-to-page navigation triggers custom staggered fade-ins with a $10\text{px}$ upward translate motion over $250\text{ms}$ for high-fidelity interactive flow.

### B. Interactive Analytics Dashboard (`OverviewSection.tsx`)
*   **KPI Scorecard Grid:** Real-time overview of:
    1.  *Inventory Value:* Total valuation computed from raw active balances.
    2.  *Low Stock Alert:* Active inventory counts flagging items requiring ordering.
    3.  *Purchase Requests:* High-priority items awaiting manager signoff.
    4.  *Procurement Cost:* Monthly expenditure figures.
    5.  *Warehouse Capacity:* Storage usage metrics.
*   **Valuation Trend Plot:** An interactive SVG line plot displaying historical data. Hovering points activates vertical grid lines, scale highlights, and absolute value tooltips.
*   **Sourcing Spend Chart:** An interactive SVG bar chart. Hovering columns triggers brightness-shifted active gradients and absolute monthly cost metadata.

### C. Predictive Procurement (`AIInsightsSection.tsx`)
*   **Predictive Stockout Alerts:** Computes lead times and inventory depletion curves to flag urgent item shortfalls.
*   **Alternative Supplier Recommendations:** Identifies competing suppliers, calculates potential monthly savings, and provides single-click execution options.
*   **Demand Forecast Predictor:** Custom SVG cubic Bezier curve predicting autumn requirement waves.

### D. Material Inventory & Tables System (`ProductsSection.tsx`, etc.)
*   **Sticky Header Tables:** Facilitates reading long lists of materials without losing context.
*   **Sortable Columns:** Custom sort indicator states indicating column ordering (Ascending/Descending).
*   **Interactive Search Highlighting:** Custom split RegExp matches query keywords on items, SKUs, and vendors with an active indigo background highlight.
*   **Empty State Cards:** Illustrative placeholders with secondary action buttons shown when filtered queries return zero records.

---

## 5. Visual Polish & Micro-interactions
*   **Sidebar Transitions:** Inactive sidebar items transition over $220\text{ms}$ with subtle background shifts and purple glow borders.
*   **KPI Card Lifting:** Actionable dashboard blocks scale up by $3\text{px}$ on hover with dynamic shadow depth.
*   **Status Badge Glows:** Color-coded badges (Emerald, Amber, Rose, Indigo) apply a soft outer-glow blur on hover to emphasize system status.
*   **Toast System:** Stacked, dismissible toasts styled to correspond to system events:
    *   *Success:* Green verification check for actions executed safely.
    *   *Error:* Crimson alert for failed queries.
    *   *Warning:* Amber shield warning for extended lead times.
    *   *Info:* Indigo info alerts for model updates.
*   **Skeleton Loading:** Triggered on tab changes to simulate network processing and maintain layout stability.

---

## 6. Proposed Database Schema (Supabase / PostgreSQL)

Below is the database schema mapped to support the current data model in `dashboardData.ts`.

### Table: `users`
Tracks authorized ERP administrators and managers.
```sql
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text not null,
  role text not null default 'viewer', -- 'viewer', 'sourcing_admin', 'manager'
  organization text not null default 'Acme Sourcing Hub',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Table: `products`
Stores inventory materials, categories, pricing, and supplier info.
```sql
create table public.products (
  id text not null primary key, -- e.g. 'PRD-001'
  sku text not null unique,
  name text not null,
  category text not null,
  unit_price numeric(12,2) not null,
  lead_time_days integer not null,
  primary_vendor text not null,
  stock_status text not null, -- 'In Stock', 'Low Stock', 'Out of Stock'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Table: `purchase_requests`
Maintains internal requests initiated by logistics operators.
```sql
create table public.purchase_requests (
  id text not null primary key, -- e.g. 'PR-2026-001'
  product_name text not null,
  quantity integer not null,
  estimated_cost numeric(12,2) not null,
  requestor text not null,
  department text not null,
  status text not null default 'Pending', -- 'Pending', 'Approved', 'Rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Table: `notifications`
Supports the slide-out notifications alerts feed.
```sql
create table public.notifications (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  read boolean not null default false,
  time_label text not null, -- e.g., '10m ago'
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Table: `activity_logs`
Backs the real-time activity tracking feed on the main dashboard.
```sql
create table public.activity_logs (
  id bigint generated always as identity primary key,
  action text not null,
  details text not null,
  type text not null, -- 'success', 'warning', 'info'
  timestamp text not null, -- e.g., 'Just now'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 7. Security & Row-Level Security (RLS) Policies
To ensure compliance with enterprise-grade resource isolation, the database must enforce the following RLS principles:

1.  **Product Management Policies:**
    *   *Read Access:* Authenticated members of the same organization can view the material catalog.
    *   *Write/Delete Access:* Restricted to users holding the `'sourcing_admin'` or `'manager'` roles.
2.  **Purchase Authorization Policies:**
    *   *Create Access:* Any authenticated employee can submit a request.
    *   *Approval/Rejection Access:* Strictly restricted to managers (`role = 'manager'`).

```sql
-- Enable Row Level Security on products
alter table public.products enable row level security;

-- Policy: Allow all authenticated users of organization to read
create policy "Allow authorized reading"
  on public.products for select
  to authenticated
  using (true);

-- Policy: Only allow Sourcing Admins or Managers to modify products
create policy "Allow write modifications"
  on public.products for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() 
      and users.role in ('sourcing_admin', 'manager')
    )
  );
```

---

## 8. Development Timeline & Migration Path

```
Phase 1: Database Setup (1-2 days)
└── Setup Supabase Project & Execute DB Schemas
└── Provision Row-Level Security Rules & Storage Buckets

Phase 2: Authentication (1 day)
└── Bind Login/Logout Screens with Supabase Auth Provider
└── Setup RBAC Metadata claims in user profiles

Phase 3: State Sync & CRUD Operations (2-3 days)
└── Replace client mock lists with real-time Supabase hooks
└── Setup Postgres Realtime Channel for alerts & activities

Phase 4: Optimization & Final Verification (1 day)
└── Set up Edge Function for periodic AI predictive calculation runs
└── Compile application production build & verify with linter
```

---
