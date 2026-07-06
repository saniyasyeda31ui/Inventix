-- =============================================================================
-- Inventix ERP — Production Database Schema
-- Migration: 20260630000000_init_schema.sql
--
-- Execution target : Supabase SQL Editor (single run)
-- PostgreSQL version: 15+ (Supabase default)
--
-- DEPENDENCY-SAFE EXECUTION ORDER:
--   0.  Safety DROPs
--   1.  set_updated_at() helper  ← no table dependency
--   2.  TABLE definitions        ← dependency-ordered (profiles first)
--   3.  handle_new_user() + trigger  ← requires profiles table
--   4.  Role-check helpers       ← requires profiles table
--   5.  Enable RLS on all tables
--   6.  RLS policies             ← require role-check functions
--   7.  Realtime subscriptions
--   8.  Seed data
--
-- HOW TO EXECUTE:
--   Supabase Dashboard → SQL Editor → New query
--   Paste entire file → Run (Ctrl+Enter)
--   Expected result: "Success. No rows returned."
-- =============================================================================


-- =============================================================================
-- SECTION 0: SAFETY — drop everything cleanly for re-runs during development.
-- WARNING: Remove or comment this section before running on a production db.
-- =============================================================================

drop table if exists public.system_settings         cascade;
drop table if exists public.saved_reports           cascade;
drop table if exists public.ai_recommendations      cascade;
drop table if exists public.activity_logs           cascade;
drop table if exists public.notifications           cascade;
drop table if exists public.payments                cascade;
drop table if exists public.purchase_orders         cascade;
drop table if exists public.purchase_requests       cascade;
drop table if exists public.inventory_balances      cascade;
drop table if exists public.warehouses              cascade;
drop table if exists public.products                cascade;
drop table if exists public.vendors                 cascade;
drop table if exists public.employees               cascade;
drop table if exists public.companies               cascade;
drop table if exists public.profiles                cascade;

drop function if exists public.handle_new_user()     cascade;
drop function if exists public.is_manager()          cascade;
drop function if exists public.is_sourcing_admin()   cascade;
drop function if exists public.is_admin_or_manager() cascade;
drop function if exists public.set_updated_at()      cascade;


-- =============================================================================
-- SECTION 1: set_updated_at() — no table dependency, safe to create first.
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


-- =============================================================================
-- SECTION 2: TABLE DEFINITIONS  (dependency-ordered)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2-A. PROFILES — must be created first; nearly every other table references it.
-- Mirrors auth.users. A trigger (Section 3) auto-inserts a row on signup.
-- -----------------------------------------------------------------------------
create table public.profiles (
  id            uuid        not null primary key references auth.users on delete cascade,
  email         text        not null,
  full_name     text        not null default 'ERP Specialist',
  role          text        not null default 'viewer'
                            check (role in ('viewer', 'sourcing_admin', 'manager')),
  organization  text        not null default 'Acme Sourcing Hub',
  updated_at    timestamptz not null default timezone('utc', now()),
  created_at    timestamptz not null default timezone('utc', now())
);

comment on table  public.profiles      is 'Application user profiles linked 1-to-1 with auth.users.';
comment on column public.profiles.role is 'viewer | sourcing_admin | manager — drives RLS and UI visibility.';

create index idx_profiles_role on public.profiles(role);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 2-B. COMPANIES — standalone, no FK dependencies.
-- -----------------------------------------------------------------------------
create table public.companies (
  id                  uuid         not null primary key default gen_random_uuid(),
  name                text         not null,
  tax_identifier      text         not null unique,
  address_line_1      text         not null,
  address_line_2      text,
  city                text         not null,
  state               text         not null,
  postal_code         text         not null,
  country             text         not null,
  reporting_currency  text         not null default 'USD',
  fiscal_year_start   date         not null,
  updated_at          timestamptz  not null default timezone('utc', now()),
  created_at          timestamptz  not null default timezone('utc', now())
);

comment on table public.companies is 'Primary organisational entities. Supports multi-subsidiary layouts.';

create trigger trg_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 2-C. EMPLOYEES — depends on profiles; self-referencing manager_id.
-- -----------------------------------------------------------------------------
create table public.employees (
  id          uuid        not null primary key default gen_random_uuid(),
  user_id     uuid        references public.profiles(id) on delete set null,
  full_name   text        not null,
  work_email  text        not null unique,
  department  text        not null
              check (department in ('Sourcing','Logistics','Finance','Operations',
                                    'Engineering','Maintenance','Procurement')),
  title       text        not null,
  manager_id  uuid        references public.employees(id) on delete set null,
  status      text        not null default 'Active'
              check (status in ('Active','On Leave','Suspended','Archived')),
  created_at  timestamptz not null default timezone('utc', now())
);

comment on table  public.employees            is 'Corporate personnel directory with departmental assignment and reporting hierarchy.';
comment on column public.employees.manager_id is 'Self-referencing FK to direct-line supervisor. NULL = top of hierarchy.';

create index idx_employees_user_id  on public.employees(user_id);
create index idx_employees_status   on public.employees(status);
create index idx_employees_manager  on public.employees(manager_id);


-- -----------------------------------------------------------------------------
-- 2-D. VENDORS — standalone supplier registry.
-- -----------------------------------------------------------------------------
create table public.vendors (
  id                    uuid          not null primary key default gen_random_uuid(),
  code                  text          not null unique,
  name                  text          not null,
  contact_name          text,
  contact_email         text          not null
                        check (contact_email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'),
  contact_phone         text,
  payment_terms         text          not null default 'Net 30',
  quality_rating_pct    numeric(5,2)  not null default 100.00
                        check (quality_rating_pct  between 0.00 and 100.00),
  on_time_delivery_pct  numeric(5,2)  not null default 100.00
                        check (on_time_delivery_pct between 0.00 and 100.00),
  category              text,
  status                text          not null default 'Qualified'
                        check (status in ('Qualified','Preferred','Approved',
                                          'Under Review','Disqualified','Suspended')),
  created_at            timestamptz   not null default timezone('utc', now())
);

comment on table public.vendors is 'Approved supplier registry with quality and delivery performance metrics.';

create index idx_vendors_status on public.vendors(status);
create index idx_vendors_code   on public.vendors(code);


-- -----------------------------------------------------------------------------
-- 2-E. PRODUCTS — standalone material catalog.
-- -----------------------------------------------------------------------------
create table public.products (
  id              text          not null primary key,
  sku             text          not null unique,
  name            text          not null,
  category        text          not null,
  unit_price      numeric(12,2) not null check (unit_price > 0.00),
  lead_time_days  integer       not null check (lead_time_days >= 0),
  primary_vendor  text          not null,
  stock_status    text          not null default 'In Stock'
                  check (stock_status in ('In Stock','Low Stock','Out of Stock','Discontinued')),
  created_at      timestamptz   not null default timezone('utc', now())
);

comment on table public.products is 'Material master catalog. stock_status is a convenience field refreshed by triggers or Edge Functions.';

create index idx_products_sku          on public.products(sku);
create index idx_products_stock_status on public.products(stock_status);
create index idx_products_category     on public.products(category);


-- -----------------------------------------------------------------------------
-- 2-F. WAREHOUSES — depends on employees (manager_id).
-- -----------------------------------------------------------------------------
create table public.warehouses (
  id                    uuid          not null primary key default gen_random_uuid(),
  code                  text          not null unique,
  name                  text          not null,
  location              text          not null,
  max_cubic_capacity    numeric(12,2) not null check (max_cubic_capacity > 0),
  current_occupancy_pct numeric(5,2)  not null default 0.00
                        check (current_occupancy_pct between 0.00 and 100.00),
  manager_id            uuid          references public.employees(id) on delete set null,
  status                text          not null default 'Active'
                        check (status in ('Active','Maintenance','At Capacity','Inactive')),
  updated_at            timestamptz   not null default timezone('utc', now()),
  created_at            timestamptz   not null default timezone('utc', now())
);

comment on table public.warehouses is 'Physical fulfilment centres with volumetric capacity and assignment metadata.';

create index idx_warehouses_status on public.warehouses(status);
create index idx_warehouses_code   on public.warehouses(code);

create trigger trg_warehouses_updated_at
  before update on public.warehouses
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 2-G. INVENTORY BALANCES — depends on products + warehouses.
-- -----------------------------------------------------------------------------
create table public.inventory_balances (
  id               uuid         not null primary key default gen_random_uuid(),
  product_id       text         not null references public.products(id) on delete cascade,
  warehouse_id     uuid         not null references public.warehouses(id) on delete cascade,
  on_hand_qty      integer      not null default 0  check (on_hand_qty >= 0),
  allocated_qty    integer      not null default 0  check (allocated_qty >= 0),
  safety_stock_qty integer      not null default 50 check (safety_stock_qty >= 0),
  updated_at       timestamptz  not null default timezone('utc', now()),
  unique (product_id, warehouse_id)
);

comment on table public.inventory_balances is 'Live quantity ledger: one row per product-warehouse combination. on_hand_qty cannot go below 0.';

create index idx_inv_product   on public.inventory_balances(product_id);
create index idx_inv_warehouse on public.inventory_balances(warehouse_id);
create index idx_inv_on_hand   on public.inventory_balances(on_hand_qty);

create trigger trg_inventory_balances_updated_at
  before update on public.inventory_balances
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 2-H. PURCHASE REQUESTS — depends on profiles + products.
-- -----------------------------------------------------------------------------
create table public.purchase_requests (
  id               text          not null primary key,
  product_name     text          not null,
  product_id       text          references public.products(id) on delete set null,
  quantity         integer       not null check (quantity > 0),
  estimated_cost   numeric(12,2) not null check (estimated_cost >= 0.00),
  requestor        text          not null,
  requestor_id     uuid          references public.profiles(id) on delete set null,
  department       text          not null,
  priority         text          not null default 'Medium'
                   check (priority in ('Low','Medium','High','Critical')),
  expected_delivery date,
  supplier         text,
  status           text          not null default 'Pending'
                   check (status in ('Pending','Approved','Rejected')),
  approved_by      uuid          references public.profiles(id) on delete set null,
  approved_at      timestamptz,
  created_at       timestamptz   not null default timezone('utc', now())
);

comment on table public.purchase_requests is 'Procurement drafts. Only managers may approve (enforced by RLS update policy).';

create index idx_pr_status       on public.purchase_requests(status);
create index idx_pr_requestor_id on public.purchase_requests(requestor_id);
create index idx_pr_created_at   on public.purchase_requests(created_at desc);


-- -----------------------------------------------------------------------------
-- 2-I. PURCHASE ORDERS — depends on purchase_requests + vendors + profiles.
-- -----------------------------------------------------------------------------
create table public.purchase_orders (
  id                   uuid          not null primary key default gen_random_uuid(),
  po_number            text          not null unique,
  purchase_request_id  text          references public.purchase_requests(id) on delete set null,
  vendor_id            uuid          not null references public.vendors(id) on delete restrict,
  total_amount         numeric(12,2) not null check (total_amount >= 0.00),
  status               text          not null default 'Draft'
                       check (status in ('Draft','Pending Approval','Sent',
                                         'Partially Received','Received','Completed','Cancelled')),
  promised_date        date,
  items_count          integer       not null default 0 check (items_count >= 0),
  buyer                text,
  created_by           uuid          references public.profiles(id) on delete set null,
  created_at           timestamptz   not null default timezone('utc', now())
);

comment on table public.purchase_orders is 'Formal vendor contracts. Status lifecycle: Draft → Sent → [Partially] Received → Completed.';

create index idx_po_status     on public.purchase_orders(status);
create index idx_po_vendor_id  on public.purchase_orders(vendor_id);
create index idx_po_created_at on public.purchase_orders(created_at desc);
create index idx_po_pr_id      on public.purchase_orders(purchase_request_id);


-- -----------------------------------------------------------------------------
-- 2-J. PAYMENTS — depends on purchase_orders.
-- -----------------------------------------------------------------------------
create table public.payments (
  id                  uuid          not null primary key default gen_random_uuid(),
  invoice_number      text          not null unique,
  purchase_order_id   uuid          not null references public.purchase_orders(id) on delete restrict,
  amount_paid         numeric(12,2) not null check (amount_paid >= 0.00),
  payment_method      text          not null
                      check (payment_method in ('ACH','ACH Transfer','Wire','Wire Transfer',
                                                 'Check','Credit Card')),
  status              text          not null default 'Unpaid'
                      check (status in ('Unpaid','Pending','Processing','Paid','Overdue','Disputed')),
  due_date            date          not null,
  paid_at             timestamptz,
  created_at          timestamptz   not null default timezone('utc', now())
);

comment on table public.payments is 'Accounts payable transactions. status drives aging reports and overdue alerts.';

create index idx_payments_status   on public.payments(status);
create index idx_payments_due_date on public.payments(due_date);
create index idx_payments_po_id    on public.payments(purchase_order_id);


-- -----------------------------------------------------------------------------
-- 2-K. NOTIFICATIONS — depends on profiles.
-- -----------------------------------------------------------------------------
create table public.notifications (
  id          uuid        not null primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null,
  read        boolean     not null default false,
  time_label  text        not null default 'Just now',
  user_id     uuid        references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default timezone('utc', now())
);

comment on table public.notifications is 'Per-user or broadcast alerts. Realtime INSERT events power the slide-out drawer.';

create index idx_notifications_user_id    on public.notifications(user_id);
create index idx_notifications_read       on public.notifications(read);
create index idx_notifications_created_at on public.notifications(created_at desc);


-- -----------------------------------------------------------------------------
-- 2-L. ACTIVITY LOGS — depends on profiles (optional user_id).
-- bigint identity preserves insertion order cheaply.
-- -----------------------------------------------------------------------------
create table public.activity_logs (
  id          bigint      not null generated always as identity primary key,
  action      text        not null,
  details     text        not null,
  type        text        not null check (type in ('success','warning','info')),
  timestamp   text        not null default 'Just now',
  user_id     uuid        references public.profiles(id) on delete set null,
  created_at  timestamptz not null default timezone('utc', now())
);

comment on table public.activity_logs is 'Immutable audit feed. Realtime INSERT events update the Overview dashboard live.';

create index idx_activity_created_at on public.activity_logs(created_at desc);
create index idx_activity_type       on public.activity_logs(type);


-- -----------------------------------------------------------------------------
-- 2-M. AI RECOMMENDATIONS — standalone; populated by Edge Functions.
-- -----------------------------------------------------------------------------
create table public.ai_recommendations (
  id                   uuid          not null primary key default gen_random_uuid(),
  item                 text          not null,
  severity             text          not null default 'medium'
                       check (severity in ('low','medium','high')),
  alert_message        text          not null,
  suggested_qty        integer       not null check (suggested_qty > 0),
  alternative_supplier text,
  estimated_savings    numeric(12,2) check (estimated_savings >= 0.00),
  status               text          not null default 'Active'
                       check (status in ('Active','Executed','Dismissed')),
  created_at           timestamptz   not null default timezone('utc', now())
);

comment on table public.ai_recommendations is 'AI engine output: stockout predictions, reorder suggestions, and savings estimates.';

create index idx_ai_severity on public.ai_recommendations(severity);
create index idx_ai_status   on public.ai_recommendations(status);


-- -----------------------------------------------------------------------------
-- 2-N. SAVED REPORTS — depends on profiles.
-- -----------------------------------------------------------------------------
create table public.saved_reports (
  id            uuid        not null primary key default gen_random_uuid(),
  title         text        not null,
  query_config  jsonb       not null default '{}',
  format        text        not null check (format in ('CSV','PDF')),
  generated_by  uuid        references public.profiles(id) on delete set null,
  file_url      text,
  created_at    timestamptz not null default timezone('utc', now())
);

comment on table public.saved_reports is 'Persisted report configs and export file links.';

create index idx_reports_generated_by on public.saved_reports(generated_by);
create index idx_reports_created_at   on public.saved_reports(created_at desc);


-- -----------------------------------------------------------------------------
-- 2-O. SYSTEM SETTINGS — depends on profiles (updated_by).
-- -----------------------------------------------------------------------------
create table public.system_settings (
  id          uuid        not null primary key default gen_random_uuid(),
  key         text        not null unique,
  value       text        not null,
  updated_by  uuid        references public.profiles(id) on delete set null,
  updated_at  timestamptz not null default timezone('utc', now())
);

comment on table public.system_settings is 'Global key-value application configuration. Writable only by managers.';

create trigger trg_system_settings_updated_at
  before update on public.system_settings
  for each row execute function public.set_updated_at();


-- =============================================================================
-- SECTION 3: AUTH TRIGGER
-- profiles table now exists — safe to create handle_new_user().
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, organization)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name',     'ERP Specialist'),
    coalesce(new.raw_user_meta_data ->> 'role',          'viewer'),
    coalesce(new.raw_user_meta_data ->> 'organization',  'Acme Sourcing Hub')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =============================================================================
-- SECTION 4: ROLE-CHECK HELPER FUNCTIONS
-- profiles table now exists — language sql bodies are validated at creation.
-- These use security definer so RLS policies cannot be bypassed by JWT spoofing.
-- =============================================================================

create or replace function public.is_manager()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id   = auth.uid()
      and role = 'manager'
  );
$$;

create or replace function public.is_sourcing_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id   = auth.uid()
      and role = 'sourcing_admin'
  );
$$;

create or replace function public.is_admin_or_manager()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id   = auth.uid()
      and role in ('sourcing_admin', 'manager')
  );
$$;


-- =============================================================================
-- SECTION 5: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================================================

alter table public.profiles           enable row level security;
alter table public.companies          enable row level security;
alter table public.employees          enable row level security;
alter table public.products           enable row level security;
alter table public.vendors            enable row level security;
alter table public.warehouses         enable row level security;
alter table public.inventory_balances enable row level security;
alter table public.purchase_requests  enable row level security;
alter table public.purchase_orders    enable row level security;
alter table public.payments           enable row level security;
alter table public.notifications      enable row level security;
alter table public.activity_logs      enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.saved_reports      enable row level security;
alter table public.system_settings    enable row level security;


-- =============================================================================
-- SECTION 6: ROW LEVEL SECURITY POLICIES
-- Role-check functions now exist — safe to reference them here.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
create policy "profiles: authenticated users can read all"
  on public.profiles for select to authenticated using (true);

create policy "profiles: users can update own row"
  on public.profiles for update to authenticated
  using (id = auth.uid());

create policy "profiles: managers can update any row"
  on public.profiles for update to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- COMPANIES
-- ---------------------------------------------------------------------------
create policy "companies: authenticated users can read"
  on public.companies for select to authenticated using (true);

create policy "companies: managers can insert"
  on public.companies for insert to authenticated
  with check (public.is_manager());

create policy "companies: managers can update"
  on public.companies for update to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- EMPLOYEES
-- ---------------------------------------------------------------------------
create policy "employees: authenticated users can read"
  on public.employees for select to authenticated using (true);

create policy "employees: managers can insert"
  on public.employees for insert to authenticated
  with check (public.is_manager());

create policy "employees: managers can update"
  on public.employees for update to authenticated
  using (public.is_manager());

create policy "employees: managers can delete"
  on public.employees for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------------
create policy "products: authenticated users can read"
  on public.products for select to authenticated using (true);

create policy "products: admins and managers can insert"
  on public.products for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "products: admins and managers can update"
  on public.products for update to authenticated
  using (public.is_admin_or_manager());

create policy "products: admins and managers can delete"
  on public.products for delete to authenticated
  using (public.is_admin_or_manager());


-- ---------------------------------------------------------------------------
-- VENDORS
-- ---------------------------------------------------------------------------
create policy "vendors: authenticated users can read"
  on public.vendors for select to authenticated using (true);

create policy "vendors: admins and managers can insert"
  on public.vendors for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "vendors: admins and managers can update"
  on public.vendors for update to authenticated
  using (public.is_admin_or_manager());

create policy "vendors: managers only can delete"
  on public.vendors for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- WAREHOUSES
-- ---------------------------------------------------------------------------
create policy "warehouses: authenticated users can read"
  on public.warehouses for select to authenticated using (true);

create policy "warehouses: admins and managers can insert"
  on public.warehouses for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "warehouses: admins and managers can update"
  on public.warehouses for update to authenticated
  using (public.is_admin_or_manager());

create policy "warehouses: admins and managers can delete"
  on public.warehouses for delete to authenticated
  using (public.is_admin_or_manager());


-- ---------------------------------------------------------------------------
-- INVENTORY BALANCES
-- ---------------------------------------------------------------------------
create policy "inventory_balances: authenticated users can read"
  on public.inventory_balances for select to authenticated using (true);

create policy "inventory_balances: admins and managers can insert"
  on public.inventory_balances for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "inventory_balances: admins and managers can update"
  on public.inventory_balances for update to authenticated
  using (public.is_admin_or_manager());

create policy "inventory_balances: managers only can delete"
  on public.inventory_balances for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- PURCHASE REQUESTS
-- ---------------------------------------------------------------------------
create policy "purchase_requests: authenticated users can read"
  on public.purchase_requests for select to authenticated using (true);

create policy "purchase_requests: authenticated users can insert"
  on public.purchase_requests for insert to authenticated
  with check (true);

create policy "purchase_requests: requestors can update own pending requests"
  on public.purchase_requests for update to authenticated
  using (requestor_id = auth.uid() and status = 'Pending');

create policy "purchase_requests: managers can approve or reject"
  on public.purchase_requests for update to authenticated
  using (public.is_manager());

create policy "purchase_requests: managers can delete"
  on public.purchase_requests for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- PURCHASE ORDERS
-- ---------------------------------------------------------------------------
create policy "purchase_orders: authenticated users can read"
  on public.purchase_orders for select to authenticated using (true);

create policy "purchase_orders: admins and managers can insert"
  on public.purchase_orders for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "purchase_orders: admins and managers can update"
  on public.purchase_orders for update to authenticated
  using (public.is_admin_or_manager());

create policy "purchase_orders: managers can delete"
  on public.purchase_orders for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------
create policy "payments: authenticated users can read"
  on public.payments for select to authenticated using (true);

create policy "payments: managers can insert"
  on public.payments for insert to authenticated
  with check (public.is_manager());

create policy "payments: managers can update"
  on public.payments for update to authenticated
  using (public.is_manager());

create policy "payments: managers can delete"
  on public.payments for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create policy "notifications: users read own or broadcast"
  on public.notifications for select to authenticated
  using (user_id = auth.uid() or user_id is null);

create policy "notifications: admins and managers can insert"
  on public.notifications for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "notifications: users can mark own as read"
  on public.notifications for update to authenticated
  using (user_id = auth.uid());

create policy "notifications: managers can update any"
  on public.notifications for update to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- ACTIVITY LOGS
-- ---------------------------------------------------------------------------
create policy "activity_logs: authenticated users can read"
  on public.activity_logs for select to authenticated using (true);

create policy "activity_logs: authenticated users can insert"
  on public.activity_logs for insert to authenticated with check (true);

create policy "activity_logs: managers can delete"
  on public.activity_logs for delete to authenticated
  using (public.is_manager());


-- ---------------------------------------------------------------------------
-- AI RECOMMENDATIONS
-- ---------------------------------------------------------------------------
create policy "ai_recommendations: authenticated users can read"
  on public.ai_recommendations for select to authenticated using (true);

create policy "ai_recommendations: admins and managers can insert"
  on public.ai_recommendations for insert to authenticated
  with check (public.is_admin_or_manager());

create policy "ai_recommendations: admins and managers can update status"
  on public.ai_recommendations for update to authenticated
  using (public.is_admin_or_manager());


-- ---------------------------------------------------------------------------
-- SAVED REPORTS
-- ---------------------------------------------------------------------------
create policy "saved_reports: users read own reports"
  on public.saved_reports for select to authenticated
  using (generated_by = auth.uid() or public.is_manager());

create policy "saved_reports: authenticated users can insert"
  on public.saved_reports for insert to authenticated
  with check (generated_by = auth.uid());

create policy "saved_reports: users delete own, managers delete any"
  on public.saved_reports for delete to authenticated
  using (generated_by = auth.uid() or public.is_manager());


-- ---------------------------------------------------------------------------
-- SYSTEM SETTINGS
-- ---------------------------------------------------------------------------
create policy "system_settings: authenticated users can read"
  on public.system_settings for select to authenticated using (true);

create policy "system_settings: managers can insert"
  on public.system_settings for insert to authenticated
  with check (public.is_manager());

create policy "system_settings: managers can update"
  on public.system_settings for update to authenticated
  using (public.is_manager());


-- =============================================================================
-- SECTION 7: REALTIME SUBSCRIPTIONS
-- These tables power the live dashboard feed and notifications drawer.
-- =============================================================================

alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.activity_logs;
alter publication supabase_realtime add table public.inventory_balances;
alter publication supabase_realtime add table public.purchase_requests;


-- =============================================================================
-- SECTION 8: SEED DATA
-- Matches the frontend mock datasets in dashboardData.ts exactly.
-- Safe to run on a fresh project. Remove for clean production deployments.
-- =============================================================================

-- Vendors
insert into public.vendors
  (code, name, contact_name, contact_email, contact_phone, payment_terms,
   quality_rating_pct, on_time_delivery_pct, category, status)
values
  ('VNDR-STEEL',    'SteelWorks Ltd',       'James Henderson',  'j.henderson@steelworks.com',  '+1-312-555-0101', 'Net 30', 96.00, 98.20, 'Metals',            'Preferred'),
  ('VNDR-INTEL',    'Intel Sourcing',        'Marcus Chen',      'm.chen@intelsourcing.com',    '+1-408-555-0202', 'Net 45', 94.00, 92.50, 'Semiconductors',    'Preferred'),
  ('VNDR-PLASTIC',  'Global Plastics Corp',  'Elena Geller',     'geller@globalplastics.com',   '+49-40-555-0303', 'Net 30', 92.00, 95.00, 'Plastics',          'Approved'),
  ('VNDR-BELGRAVE', 'Belgrave Chemicals',    'Arthur Pendelton', 'pendelton@belgrave.org',      '+44-20-555-0404', 'Net 60', 89.00, 90.10, 'Energy Cells',      'Under Review'),
  ('VNDR-VALVES',   'Valves and Fittings Inc','Rita Gomez',      'rgomez@valvesfittings.com',   '+1-713-555-0505', 'Net 30', 91.00, 96.40, 'Components',        'Approved'),
  ('VNDR-APEX',     'Apex Logistics Ltd',    'Marcus Vance',     'vance@apexlog.co.uk',         '+44-161-555-0606','Net 30', 84.00, 88.90, 'Freight Forwarding','Under Review');

-- Products
insert into public.products
  (id, sku, name, category, unit_price, lead_time_days, primary_vendor, stock_status)
values
  ('PROD-201', 'COP-TUB-X500',  'Copper Tubing (Grade-X)',            'Bulk Materials', 12.50,  7,  'SteelWorks Ltd',        'In Stock'),
  ('PROD-202', 'LITH-CYL-B820', 'Lithium-Ion Cylinders (Type B)',     'Energy Cells',   35.00,  14, 'Belgrave Chemicals',    'In Stock'),
  ('PROD-203', 'SIL-WAF-T100',  'Silicon-Wafers (Tier-1 Enterprise)', 'Semiconductors', 125.00, 21, 'Intel Sourcing',        'Low Stock'),
  ('PROD-204', 'CARB-ST-S910',  'Structural Carbon Steel Bars',       'Metals',         48.00,  5,  'SteelWorks Ltd',        'Low Stock'),
  ('PROD-205', 'POLY-HD-R400',  'High-Density Polymer Reels',         'Plastics',       9.20,   8,  'Global Plastics Corp',  'In Stock'),
  ('PROD-206', 'CER-TERM-B20',  'Ceramic Terminal Blocks',            'Components',     4.50,   4,  'Valves and Fittings Inc','In Stock'),
  ('PROD-207', 'TIT-ALL-F44',   'Titanium Alloy Hex Fasteners',       'Components',     15.80,  10, 'SteelWorks Ltd',        'In Stock'),
  ('PROD-208', 'VALV-PRE-V12',  'Pressure Relief Valves',             'Components',     85.00,  12, 'Valves and Fittings Inc','In Stock');

-- Companies
insert into public.companies
  (name, tax_identifier, address_line_1, city, state, postal_code, country,
   reporting_currency, fiscal_year_start)
values
  ('Acme Sourcing Hub', 'US-TAX-ACME-2026', '1200 Procurement Drive',
   'Chicago', 'Illinois', '60601', 'United States', 'USD', '2026-01-01'::date);

-- Warehouses
insert into public.warehouses
  (code, name, location, max_cubic_capacity, current_occupancy_pct, status)
values
  ('WH-001', 'Chicago Warehouse',    'Midwest Logistics Hub, IL',           120000, 85.00, 'Active'),
  ('WH-002', 'Rotterdam Warehouse',  'Europort Zone, Netherlands',          250000, 72.00, 'Active'),
  ('WH-003', 'Singapore Warehouse',  'Changi Logistics Complex, Singapore', 180000, 90.00, 'At Capacity'),
  ('WH-004', 'Bangalore Warehouse',  'Whitefield Sector 4, India',           95000, 60.00, 'Active'),
  ('WH-005', 'Houston Storage Yard', 'Gulf Port Terminals, TX',              80000, 35.00, 'Active');

-- Inventory Balances
insert into public.inventory_balances
  (product_id, warehouse_id, on_hand_qty, allocated_qty, safety_stock_qty)
select
  p.id,
  w.id,
  case
    when p.sku = 'COP-TUB-X500'  and w.code = 'WH-001' then 12500
    when p.sku = 'LITH-CYL-B820' and w.code = 'WH-002' then 8200
    when p.sku = 'SIL-WAF-T100'  and w.code = 'WH-003' then 4200
    when p.sku = 'CARB-ST-S910'  and w.code = 'WH-004' then 150
    when p.sku = 'POLY-HD-R400'  and w.code = 'WH-002' then 6100
    else 0
  end,
  0,
  case
    when p.sku = 'SIL-WAF-T100' then 1000
    when p.sku = 'CARB-ST-S910' then 500
    else 200
  end
from public.products p
cross join public.warehouses w
where
  (p.sku = 'COP-TUB-X500'  and w.code = 'WH-001') or
  (p.sku = 'LITH-CYL-B820' and w.code = 'WH-002') or
  (p.sku = 'SIL-WAF-T100'  and w.code = 'WH-003') or
  (p.sku = 'CARB-ST-S910'  and w.code = 'WH-004') or
  (p.sku = 'POLY-HD-R400'  and w.code = 'WH-002');

-- Purchase Requests
insert into public.purchase_requests
  (id, product_name, quantity, estimated_cost, requestor, department,
   priority, status, expected_delivery, supplier)
values
  ('PR-2026-001','High-Density Polymer Reels',  1000, 12450.00,'Sarah Jenkins', 'Operations', 'High',    'Pending', '2026-07-10'::date,'Global Plastics Corp'),
  ('PR-2026-002','Silicon-Wafers (Tier-1)',       360, 45000.00,'David Chen',    'Engineering','Critical','Approved','2026-07-05'::date,'Intel Sourcing'),
  ('PR-2026-003','Grade-X Copper Tubing',         656,  8200.00,'Elena Rostova', 'Maintenance','Medium',  'Pending', '2026-07-12'::date,'SteelWorks Ltd'),
  ('PR-2026-004','Industrial Storage Pallets',    100,  3100.00,'Marcus Vance',  'Logistics',  'Low',     'Approved','2026-07-08'::date,'Apex Logistics Ltd'),
  ('PR-2026-005','Lithium-Ion Cylinders',          26, 15600.00,'Aisha Rahman',  'Procurement','High',    'Rejected','2026-07-15'::date,'Belgrave Chemicals'),
  ('PR-2026-006','Pressure Relief Valves',         64,  5400.00,'Robert Alvarez','Operations', 'Medium',  'Pending', '2026-07-20'::date,'Valves and Fittings Inc'),
  ('PR-2026-007','Reinforced Steel Struts',        460,22100.00,'Sarah Jenkins', 'Operations', 'High',    'Approved','2026-07-22'::date,'SteelWorks Ltd'),
  ('PR-2026-008','Nylon Insulator Spacers',        400,  1800.00,'David Chen',   'Engineering','Low',     'Pending', '2026-07-25'::date,'Global Plastics Corp');

-- Purchase Orders
insert into public.purchase_orders
  (po_number, vendor_id, total_amount, status, promised_date, items_count, buyer)
select 'PO-2026-501', id, 125000.00, 'Sent',            '2026-07-05'::date, 1000, 'Alexander S.'  from public.vendors where code = 'VNDR-INTEL'
union all
select 'PO-2026-502', id,  45200.00, 'Completed',       '2026-07-02'::date, 1500, 'Alexander S.'  from public.vendors where code = 'VNDR-STEEL'
union all
select 'PO-2026-503', id,  18500.00, 'Sent',            '2026-07-10'::date, 2000, 'Sarah Jenkins' from public.vendors where code = 'VNDR-PLASTIC'
union all
select 'PO-2026-504', id,   8400.00, 'Draft',           '2026-07-15'::date,  100, 'Elena Rostova' from public.vendors where code = 'VNDR-VALVES'
union all
select 'PO-2026-505', id,  62000.00, 'Pending Approval','2026-07-20'::date,  500, 'Alexander S.'  from public.vendors where code = 'VNDR-BELGRAVE';

-- Payments
insert into public.payments
  (invoice_number, purchase_order_id, amount_paid, payment_method, status, due_date)
select 'INV-2026-890', id,  45200.00, 'ACH Transfer', 'Paid',       '2026-06-30'::date from public.purchase_orders where po_number = 'PO-2026-502'
union all
select 'INV-2026-904', id, 125000.00, 'Wire Transfer','Processing', '2026-07-05'::date from public.purchase_orders where po_number = 'PO-2026-501'
union all
select 'INV-2026-911', id,  18500.00, 'ACH Transfer', 'Pending',    '2026-07-15'::date from public.purchase_orders where po_number = 'PO-2026-503'
union all
select 'INV-2026-918', id,   8400.00, 'Credit Card',  'Pending',    '2026-07-25'::date from public.purchase_orders where po_number = 'PO-2026-504'
union all
select 'INV-2026-844', id,  12300.00, 'ACH Transfer', 'Overdue',    '2026-06-20'::date from public.purchase_orders where po_number = 'PO-2026-505';

-- Activity Logs
insert into public.activity_logs (action, details, type, timestamp)
values
  ('Purchase Order PO-2026-502 approved',            'Approved by Admin Dunlap',                       'success', '10 mins ago'),
  ('Vendor ABC Metals added to approved list',       'Certified with Grade-X raw metals',              'info',    '1 hour ago'),
  ('Stock transferred to Bangalore Warehouse',       '450 units of Silicon Wafers',                    'success', '3 hours ago'),
  ('Delivery received from Global Plastics',         '1,200 units of Polyethylene',                    'success', '5 hours ago'),
  ('Low stock alert for Copper Tubing',              'Below safety threshold of 5,000 units',          'warning', 'Yesterday'),
  ('Inventory synchronised across all 5 warehouses', 'Data integrity audit passed with 99.9% accuracy','info',    'Yesterday');

-- AI Recommendations
insert into public.ai_recommendations
  (item, severity, alert_message, suggested_qty, alternative_supplier, estimated_savings, status)
values
  ('Copper Tubing (Grade-X)',            'high',  'Copper Tubes will reach low stock in 5 days based on recent demand acceleration.',      250,  'SteelWorks Ltd',       48500.00, 'Active'),
  ('Silicon-Wafers (Tier-1 Enterprise)', 'medium','Lead time from current supplier has risen from 14 to 22 days. Reorder point adjusted.', 500,  'Pacific Foundry',      null,     'Active'),
  ('Lithium-Ion Cylinders (Type B)',     'low',   'Bulk order opportunity detected for secondary energy cells.',                           1000, 'Belgrave Chemicals',  124000.00, 'Active'),
  ('Nylon Insulator Spacers',            'low',   'Demand is dropping by 15% due to alternative alloy design changes.',                    100, 'Global Plastics Corp',  18000.00, 'Active');

-- System Settings
insert into public.system_settings (key, value)
values
  ('reporting_currency',   'USD'),
  ('fiscal_year_start',    '2026-01-01'),
  ('low_stock_threshold',  '20'),
  ('default_payment_terms','Net 30'),
  ('organisation_name',    'Acme Sourcing Hub');


-- =============================================================================
-- END OF MIGRATION
-- Commit: feat(db): bootstrap postgres models and role-based RLS rules
-- =============================================================================
