# Module Requirements: Products

## 1. Business Requirements
The Products module is the master material database mapping catalog items, SKU signatures, categories, units of measure, baseline costs, standard lead-times, and preferred vendors.
- Standardize part catalog tracking across global distribution lanes.
- Facilitate rapid material lookups during purchase request drafts.

## 2. User Stories
- **As a Sourcing Specialist,** I want to create a product card with default cost indices so that my team can request pricing accurately.
- **As a Logistics Coordinator,** I want to filter products by their categories or search by SKUs to verify warehousing storage profiles.

## 3. Validations
- **SKU Format:** Must correspond to standardized company layouts (e.g., `SKU-XXXXX-YY`).
- **Pricing Value:** Unit cost must be a positive integer or decimal (e.g., `> 0.00`).

## 4. Edge Cases
- **SKU Duplicate Collision:** System must handle parallel SKU creations by applying transactional unique database locks.
- **Product Retirement:** Archiving a product must keep historic PO documents fully intact, preventing cascade deletes while locking active reorders.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.products (
  id text not null primary key, -- PRD-001
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

## 6. API Requirements
- `GET /api/products` (Accepts filters for `category`, `search`, `status` and handles pagination parameters).
- `POST /api/products` (Saves new catalog material records).
- `PUT /api/products/:id` (Updates metadata values, costs, and lead times).

## 7. UI Dependencies
- High-density table system featuring search term highlights (`HighlightText`), sort indicators, and sticky header bars.
- EmptyState cards when searching criteria return no catalog matches.

## 8. Acceptance Criteria
1. Searching lists with input queries accurately highlights matching text.
2. Saving negative price values triggers validation errors.
3. Action buttons scale slightly on cursor hovers (`button-hover-scale`).
