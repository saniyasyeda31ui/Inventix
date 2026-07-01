# Module Requirements: Inventory

## 1. Business Requirements
The Inventory module provides real-time stock balances, batch routing numbers, ledger histories, movement tracking (receipts, transfers, shrinkage), and alerts.
- Monitor stock levels dynamically to prevent factory stockouts.
- Track movement histories for structural compliance.

## 2. User Stories
- **As a Logistics Coordinator,** I want to scan stock incoming and log the quantity so that active balances reflect receipt counts instantly.
- **As a Sourcing Administrator,** I want to check which materials are triggering "Low Stock" status so that I can draft purchase orders immediately.

## 3. Validations
- **Adjustment Amounts:** Manual stock movements must include descriptive reasons (e.g. `Damage`, `Audit Correction`, `Transfer`).
- **Stock Balances:** On-hand quantities cannot slide below zero.

## 4. Edge Cases
- **Simultaneous Stock Deductions:** Concurrent dispatch requests for the last physical SKU unit must be locked with serial transaction parameters.
- **Negative Stock Outflows:** System must prevent logistics from shipping components that are not physically accounted for.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.inventory_balances (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) not null,
  warehouse_id uuid references public.warehouses(id) not null,
  on_hand_qty integer not null default 0,
  allocated_qty integer not null default 0,
  safety_stock_qty integer not null default 50,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_id, warehouse_id)
);
```

## 6. API Requirements
- `GET /api/inventory/status` (Retrieves live list of quantities, warehouse breakdowns, and critical levels).
- `POST /api/inventory/adjust` (Logs ledger adjustments, updating quantity and audit histories).

## 7. UI Dependencies
- Custom low-stock warning indicators displaying red/yellow warnings.
- Filter panels to group stock breakdowns by specific warehouse centers.

## 8. Acceptance Criteria
1. Real-time balance calculations match total transaction records.
2. Safety stock warnings trigger automated indicator indicators.
3. Stock adjustments write to transaction ledgers.
