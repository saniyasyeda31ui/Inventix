# Development Phases: Phase 01 - Supabase Provisioning & Database Setup

## 1. Phase Objectives
Establish the solid PostgreSQL database foundation inside Supabase, creating all necessary tables, constraints, foreign key mappings, indices, Row-Level Security (RLS) policies, and database triggers. Ensure that the database can perfectly back every model defined in the Inventix ERP specification.

---

## 2. Supabase & Database Schema Tasks
Execute the following SQL commands in the Supabase SQL editor to bootstrap the database container:

### A. Profiles Schema & Auto-Sync Trigger
```sql
-- Create a table for public profiles linked to Auth users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text not null,
  role text not null default 'viewer', -- 'viewer', 'sourcing_admin', 'manager'
  organization text not null default 'Acme Sourcing Hub',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Trigger to automatically insert a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'ERP Specialist'),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### B. Core Operational Tables
```sql
-- Companies Table
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_identifier text not null unique,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  reporting_currency text not null default 'USD',
  fiscal_year_start date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Employees Table (Linking profile and managers)
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  work_email text not null unique,
  department text not null, -- 'Sourcing', 'Logistics', 'Finance'
  title text not null,
  manager_id uuid references public.employees(id) on delete set null,
  status text not null default 'Active', -- 'Active', 'Suspended', 'Archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table public.products (
  id text not null primary key, -- PRD-001
  sku text not null unique,
  name text not null,
  category text not null,
  unit_price numeric(12,2) not null check (unit_price > 0.00),
  lead_time_days integer not null check (lead_time_days >= 0),
  primary_vendor text not null,
  stock_status text not null check (stock_status in ('In Stock', 'Low Stock', 'Out of Stock')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Warehouses Table
create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- e.g. 'WH-EAST-01'
  name text not null,
  location text not null,
  max_cubic_capacity numeric(12,2) not null check (max_cubic_capacity > 0),
  current_occupancy_pct numeric(5,2) not null default 0.00 check (current_occupancy_pct >= 0.00 and current_occupancy_pct <= 100.00),
  manager_id uuid references public.employees(id) on delete set null,
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inventory Balances Table
create table public.inventory_balances (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) on delete cascade not null,
  warehouse_id uuid references public.warehouses(id) on delete cascade not null,
  on_hand_qty integer not null default 0 check (on_hand_qty >= 0),
  allocated_qty integer not null default 0 check (allocated_qty >= 0),
  safety_stock_qty integer not null default 50 check (safety_stock_qty >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_id, warehouse_id)
);

-- Vendors Table
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- e.g. 'VNDR-STEEL'
  name text not null,
  contact_email text not null,
  contact_phone text,
  payment_terms text not null default 'Net 30',
  quality_rating_pct numeric(5,2) not null default 100.00,
  on_time_delivery_pct numeric(5,2) not null default 100.00,
  status text not null default 'Qualified', -- 'Qualified', 'Under Review', 'Disqualified'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Purchase Requests Table
create table public.purchase_requests (
  id text not null primary key, -- e.g. 'PR-2026-001'
  product_name text not null,
  quantity integer not null check (quantity > 0),
  estimated_cost numeric(12,2) not null check (estimated_cost >= 0.00),
  requestor text not null,
  department text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Purchase Orders Table
create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text not null unique, -- e.g. 'PO-2026-001'
  purchase_request_id text references public.purchase_requests(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete restrict not null,
  total_amount numeric(12,2) not null check (total_amount >= 0.00),
  status text not null default 'Draft' check (status in ('Draft', 'Sent', 'Partially Received', 'Received', 'Cancelled')),
  promised_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments Table
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  purchase_order_id uuid references public.purchase_orders(id) on delete restrict not null,
  amount_paid numeric(12,2) not null check (amount_paid >= 0.00),
  payment_method text not null, -- 'ACH', 'Wire', 'Check'
  status text not null default 'Unpaid' check (status in ('Unpaid', 'Pending', 'Paid', 'Disputed')),
  due_date date not null,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  read boolean not null default false,
  time_label text not null, -- e.g., '10m ago'
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity Logs Table
create table public.activity_logs (
  id bigint generated always as identity primary key,
  action text not null,
  details text not null,
  type text not null check (type in ('success', 'warning', 'info')),
  timestamp text not null, -- e.g., 'Just now'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI Recommendations Table
create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  alert_message text not null,
  suggested_qty integer not null check (suggested_qty > 0),
  alternative_supplier text,
  estimated_savings numeric(12,2) check (estimated_savings >= 0.00),
  status text not null default 'Active' check (status in ('Active', 'Executed', 'Dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 3. Row-Level Security (RLS) Policies
Enable RLS on all operational tables and provision granular role-based policies:

```sql
-- Enable RLS across all models
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.employees enable row level security;
alter table public.products enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory_balances enable row level security;
alter table public.vendors enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.ai_recommendations enable row level security;

-- General Profiles Read Policy (Admins & Managers)
create policy "Allow profile lookups for all authenticated users"
  on public.profiles for select to authenticated using (true);

-- Products Modification Policy
create policy "Sourcing Admins or Managers can edit materials"
  on public.products for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() 
      and profiles.role in ('sourcing_admin', 'manager')
    )
  );

-- Purchase Request Approvals Policy
create policy "Only managers can approve purchase requests"
  on public.purchase_requests for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() 
      and profiles.role = 'manager'
    )
  );
```

---

## 4. Testing Checklist
- [ ] Database schema triggers compile successfully with zero syntax errors.
- [ ] Primary keys, foreign keys, unique tags, and check constraints enforce values accurately.
- [ ] Row-Level Security models isolate table updates based on profile role parameters.

---

## 5. Estimations & Git Commit Milestones
- **Duration:** 1-2 Days
- **Commit Milestone:** `feat(db): bootstrap postgres models and role-based RLS rules`
