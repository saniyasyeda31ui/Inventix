# Master AI Implementation Prompts

This document contains highly comprehensive, production-ready prompts designed for an AI development agent (such as Antigravity) to execute each development phase of the **Inventix ERP** system. 

The target stack is **Next.js (App Router), React 18+, TypeScript, Tailwind CSS, and Supabase**.

---

## Prompt 1: Phase 01 - Database Setup, Schema Provisioning, and Row-Level Security (RLS)

```markdown
You are an expert full-stack developer specializing in PostgreSQL and Supabase. Your goal is to implement Phase 01 (Database Setup) for the Inventix ERP Dashboard.

### Objective
Create all database tables, triggers, constraints, indexes, and Row-Level Security (RLS) policies inside Supabase to support the Inventix ERP system.

### Coding Standards & Requirements
1. **TypeScript Type Generation:** Ensure all tables map directly to TypeScript types generated from the database schema.
2. **Referential Integrity:** Ensure cascade deletions (`on delete cascade`) and nullable fields are set with extreme care.
3. **Optimized Indexes:** Generate secondary indexes on columns heavily used for lookups, sorting, or filtering (`sku`, `created_at`, `status`, `user_id`).
4. **Row-Level Security (RLS):** Ensure RLS is enabled on ALL tables. Block all unauthenticated actions. Implement role-based policies using security-definer helper functions.

### Database Migrations to Implement
Create a migration file `supabase/migrations/20260630000000_init_schema.sql` that provisions:
1. **profiles:** Linked to `auth.users` with automated trigger function `handle_new_user()`.
2. **companies:** To store multi-subsidiary metadata.
3. **employees:** Tracking corporate departments, emails, and direct supervisor parent-child relationships.
4. **products:** Tracking product master catalogs, units, constraints, and SKUs.
5. **warehouses:** Physical storage hubs, capacity tracking, and location parameters.
6. **inventory_balances:** Real-time balances mapped to products and warehouses.
7. **vendors:** Qualified supplier data and delivery/quality performance rankings.
8. **purchase_requests:** Procurement drafting ledger.
9. **purchase_orders:** Approved purchase contract orders.
10. **payments:** Accounts payable transaction tables with due dates and receipt matches.
11. **notifications:** Alerts feed backing the sliding header drawer.
12. **activity_logs:** Real-time action histories on the overview landing grid.
13. **ai_recommendations:** Predictive stockouts and savings vectors.

### Step-by-Step Implementation Flow
1. **Bootstrap Migration File:** Create and save the full initial SQL script containing table schemas, triggers, constraints, foreign key mappings, and indexes.
2. **Enable Row-Level Security:** Define security policies for each of the 13 tables.
3. **Apply Seed Data:** Script basic seed rows for default products, warehouses, and dummy profiles to ease upcoming development.

### Testing & Verification Checklist
- Run local postgres linting on SQL configurations.
- Verify that inserting a user in `auth.users` successfully triggers an automated row creation in `public.profiles`.
- Verify RLS policies block anonymous reading or writing of product data.

### Clarifying Questions to Ask Me Before Proceeding (If Any Are Unanswered)
1. "Should we support multiple concurrent active organizations (multi-tenancy), or do we assume a single large enterprise organization by default?"
2. "Are there any custom constraints or prefix guidelines required for SKU generations or PO numbers?"
3. "Do you want to run the SQL migration directly through the local CLI tool, or should I generate the raw script for manual execution in the Supabase SQL editor?"
```

---

## Prompt 2: Phase 02 - Supabase Auth, Protection Guards, and Role Metadata Mapping

```markdown
You are a frontend security specialist. Your goal is to implement Phase 02 (Authentication & RBAC) for the Inventix ERP Dashboard.

### Objective
Setup the Supabase client interface, write custom hooks to handle active user sessions, profile lookups, and role assignments, protect UI route segments, and construct a high-fidelity dark login screen.

### Files to Modify / Create
- **Create:** `src/lib/supabaseClient.ts` (Supabase initialized instance).
- **Create:** `src/hooks/useAuth.tsx` (Context provider exposing user status, session data, user profiles, metadata, and logouts).
- **Create:** `src/components/RouteGuard.tsx` (Route wrappers redirecting unauthenticated traffic to `/login` and checking authorization scopes).
- **Create:** `src/app/login/page.tsx` (Premium high-density, eye-safe midnight login template).
- **Modify:** `src/app/layout.tsx` (Wrap tree under `AuthProvider` and sync localized system parameters).

### API & Auth Requirements
- Initialize Supabase SDK client securely using client-side environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Read active JWT profile metadata payload to resolve access credentials (`viewer`, `sourcing_admin`, `manager`).
- Route unauthenticated session state exceptions to `/login` with clean query parameter forwards (`?redirectTo=/dashboard`).

### UI Design & Feedback Integration
- Ensure the Login screen reflects the **"Midnight Slate"** theme specified in `design.md`.
- Implement smooth focus rings on input fields and elegant load states (shimmer spinners) on buttons during authentications.
- Ensure role parameters are mapped onto active dashboard layouts, dynamically disabling unauthorized actions (e.g., hiding approval panels for Viewers).

### Testing & Verification Checklist
- Verify that visiting `/dashboard` without cookies immediately redirects the browser to `/login`.
- Verify that a correct user login successfully retrieves role credentials and triggers success toasts via the `ToastSystem`.
- Confirm that role changes dynamically hide/reveal corresponding elements instantly.

### Clarifying Questions to Ask Me Before Proceeding (If Any Are Unanswered)
1. "Would you like to support social logins (Google, Microsoft Azure AD) in addition to standard Email/Password setups?"
2. "What are the exact redirection requirements for users with unknown or unassigned organization headers?"
3. "Do you prefer middleware-based route protection via Next.js `middleware.ts` or client-side context wraps?"
```

---

## Prompt 3: Phase 03 - State Sync, Real-time Subscriptions, and CRUD Operations

```markdown
You are a senior full-stack React developer. Your goal is to implement Phase 03 (State Sync & CRUD) for the Inventix ERP Dashboard.

### Objective
Integrate operational panels to read and write directly to Supabase. Implement keyword highlighting, column sorting, pagination, and real-time socket listeners for alerts, tracking movements, and activity logs.

### Files to Modify / Create
- **Modify:** `src/components/ProductsSection.tsx` (Re-route products table to fetch database query states).
- **Modify:** `src/components/PurchaseRequests.tsx` (Wire creation triggers and approval patch mutations).
- **Modify:** `src/components/AlertsDrawer.tsx` (Bind sliding side drawer to real-time postgres changes notifications channels).
- **Modify:** `src/components/OverviewSection.tsx` (Compute scoreboard KPIs dynamically from database valuations).

### Database Query Requirements
- **Server-Side Pagination:** Limit material rows to 10 items per page. Send range indexes (`from`, `to`) directly on requests.
- **Search Term Highlights:** Construct split regex filters mapping search queries over Name, SKU, and primary Vendor values on tables.
- **Transactions & Lock guards:** Wrap inventory balance adjustments under serial transaction bounds inside Supabase to prevent negative outflows.

### Frontend Integration Steps
1. **Hook Integrations:** Replace static demo arrays inside sections with database-bound fetch engines, matching existing props signatures exactly.
2. **Real-time Listener Hooks:** Set up Postgres Realtime Listeners inside components to detect insertions inside `notifications` and `activity_logs`.
3. **Skeleton Loading Sync:** Wire `isTabLoading` state switches to trigger clean rectangular shimmers prior to query outputs to prevent visual layout shifts.

### Testing & Verification Checklist
- Confirm that sorting columns triggers backend requests with corresponding ordering fields.
- Verify that updating database rows directly in the Supabase Dashboard instantly populates alerts in the sliding side drawer in real-time.
- Verify that empty search states render custom `EmptyState` cards displaying search keywords.

### Clarifying Questions to Ask Me Before Proceeding (If Any Are Unanswered)
1. "Should real-time subscriptions be persistent, or should we toggle listeners on and off based on tab focuses?"
2. "What fallback UI display should we trigger if real-time WebSockets fail to connect due to network filters?"
3. "Are there custom audit requirements for manual database balance adjustments?"
```

---

## Prompt 4: Phase 04 - Advanced Calculations, Edge Functions, Reporting, and Final Audits

```markdown
You are an expert backend and performance optimization engineer. Your goal is to implement Phase 04 (Advanced Calculations, Reports & Optimization) for the Inventix ERP Dashboard.

### Objective
Write and deploy cron-scheduled Edge Functions to automate demand forecasts, implement report export utilities (CSV/PDF), configure localized timezone clocks, execute design accessibility (a11y) audits, and perform final build verifications.

### Files to Modify / Create
- **Create:** `supabase/functions/calculate-demand-forecast/index.ts` (Sourcing predictor Edge calculation).
- **Create:** `src/utils/reportExporter.ts` (Tabular parser converting dataset records into formatted CSV outputs).
- **Modify:** `src/components/AIInsightsSection.tsx` (Synchronize interactive Bezier cubic curves to reflect calculated forecast curves).
- **Modify:** `src/app/dashboard/page.tsx` (Final layout tweaks, performance metrics, and localization clock bindings).

### Advanced Requirements
- **Edge Cron Trigger:** Write automated server-side edge triggers evaluating stock levels against safety stock baselines. Push high-severity AI recommendation cards when items hit critical thresholds.
- **Timezone Sync:** Synchronize system clocks to UTC variables to align distributed warehouse operations.
- **Accessibility AA Contrast Compliance:** Perform structural evaluations on border variables, highlighting mark elements, and button backgrounds to confirm colors pass WCAG AA standards (`Contrast 4.5:1` minimum).

### Frontend Integration Steps
1. **Export Utilities Binding:** Wire "Export CSV" buttons inside report modules to call CSV exporter scripts, processing thousands of lines asynchronously.
2. **Bezier Curve Integrations:** Bind dynamic control coordinates (`Cubic Bezier`) into interactive SVG chart paths to reflect calculations accurately.
3. **Production Lint Compilation:** Compile codebase using `npm run build` and resolve formatting exceptions.

### Testing & Verification Checklist
- Run local unit testing over Edge functions, confirming database values parse accurately.
- Verify exported document layouts contain clean column dividers, timestamp headers, and accurate sums.
- Verify application launches cleanly inside Docker container previews.

### Clarifying Questions to Ask Me Before Proceeding (If Any Are Unanswered)
1. "How frequently should the automated Edge forecast functions run (daily, weekly, or twice-daily)?"
2. "Should reports support multi-language translation, or is standard English sufficient for current enterprise setups?"
3. "What size boundaries or row limits should we enforce on report query limits to optimize client rendering?"
```
