# Module Requirements: Vendors

## 1. Business Requirements
The Vendors module monitors active corporate suppliers, contact information, price tiers, quality indices, on-time delivery ratings, and localized contract parameters.
- Manage profiles for qualified supply chain vendors.
- Optimize procurement based on supplier cost and performance ratings.

## 2. User Stories
- **As an Alexander S.,** I want to view a supplier's delivery rating score so that I can decide whether to switch upcoming POs to alternative vendors.
- **As a Sourcing Specialist,** I want to log a supplier's contact coordinates so that our finance team can forward automated payment transactions safely.

## 3. Validations
- **Rating Score Limits:** Quality and performance percentages must be bound between 0% and 100%.
- **Email:** Supplier primary contact coordinates must match valid formatting structures.

## 4. Edge Cases
- **Vendor Disqualification:** Archiving a supplier must halt all active purchase pipelines while preserving historic contract agreements and performance indices.
- **Supplier Address Switch:** If a supplier shifts operations mid-transit, active logistics trackers must map shipment records to the correct port addresses.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
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
```

## 6. API Requirements
- `GET /api/vendors` (Retrieves active profiles with rating filters).
- `POST /api/vendors` (Saves new supplier profile records).
- `PUT /api/vendors/:id` (Updates contact metrics and ratings).

## 7. UI Dependencies
- Supplier score cards visualizing delivery performance and quality rankings.
- Toast notifications verifying "Supplier records updated successfully."

## 8. Acceptance Criteria
1. Display on-time percentages with clear color-coded indicators.
2. Saving invalid supplier email formats triggers UI errors.
3. Vendor deletion restricted strictly to sourcing managers.
