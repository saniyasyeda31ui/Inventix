# Module Requirements: Warehouses

## 1. Business Requirements
The Warehouses module manages multiple physical storage centers, geographic delivery coordinates, capacities, physical storage allocations, and facility-specific administrative personnel.
- Manage and coordinate global fulfillment centers.
- Track volumetric constraints to prevent space bottlenecks.

## 2. User Stories
- **As a Logistics Coordinator,** I want to check physical capacities before allocating massive steel piping shipments so that I can dispatch trucks to under-utilized facilities.
- **As an Alexander S.,** I want to verify warehouse manager contacts so that I can escalate delivery holdups quickly.

## 3. Validations
- **Capacity Volume:** Volume bounds must be configured between 0% and 100%.
- **Contact Details:** Warehouse manager keys must match verified personnel entries.

## 4. Edge Cases
- **Overcapacity Dispatches:** Block physical storage allocations if capacity limits exceed 100%, triggering warnings to redirect materials.
- **Geographic Address Alterations:** Updating local shipping coordinates must update active route planners and trigger validation for active delivery transits.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- e.g. 'WH-EAST-01'
  name text not null,
  location text not null,
  max_cubic_capacity numeric(12,2) not null,
  current_occupancy_pct numeric(5,2) not null default 0.00,
  manager_id uuid references public.employees(id),
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/warehouses` (Retrieves full list of active facilities).
- `POST /api/warehouses` (Creates new warehouse records).
- `PUT /api/warehouses/:id` (Adjusts facility capacity levels).

## 7. UI Dependencies
- Custom progress bar indicators matching current capacity stats (e.g. green transitions to red beyond 90%).
- High-contrast maps or layouts referencing geographical points.

## 8. Acceptance Criteria
1. Submitting occupancy percentages above 100% is blocked.
2. Warehouse cards scale smoothly on hover, emphasizing capacity labels.
3. Inactive facilities are excluded from auto-sourcing distribution logic.
