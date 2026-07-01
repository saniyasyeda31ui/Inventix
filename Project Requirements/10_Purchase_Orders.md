# Module Requirements: Purchase Orders

## 1. Business Requirements
The Purchase Orders (PO) module converts approved Purchase Requests into binding legal contracts sent directly to vendors. This module tracks order states (Draft, Sent, Partially Received, Closed) and manages inventory inflows.
- Manage and issue official contracts to external suppliers.
- Monitor active pipeline transits and warehouse arrivals.

## 2. User Stories
- **As a Sourcing Administrator,** I want to issue an official purchase order PDF so that my target vendor receives our contract.
- **As a Logistics Coordinator,** I want to log partially received shipments to automatically update active inventory balances.

## 3. Validations
- **Shipping Dates:** Promised supplier delivery dates must be scheduled after active creation timestamps.
- **Quantities:** Received counts cannot exceed the initial purchase order boundaries.

## 4. Edge Cases
- **Damaged Shipments:** Logistics logs damaged deliveries as "Defective," updating supplier ratings and generating partial return tickets automatically.
- **Price Mismatch:** If invoice pricing does not match negotiated PO costs, system must flag transaction discrepancies for auditor reviews.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text not null unique, -- e.g. 'PO-2026-001'
  purchase_request_id text references public.purchase_requests(id),
  vendor_id uuid references public.vendors(id) not null,
  total_amount numeric(12,2) not null,
  status text not null default 'Draft', -- 'Draft', 'Sent', 'Partially Received', 'Received', 'Cancelled'
  promised_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/purchase-orders` (Retrieves tracking records with transit filters).
- `POST /api/purchase-orders` (Generates official contracts).
- `POST /api/purchase-orders/:id/receive` (Logs shipment receipts).

## 7. UI Dependencies
- Active shipping pipelines displaying transit milestones.
- Dialog modals displaying invoice receipt options.

## 8. Acceptance Criteria
1. Changing status to Received automatically triggers inventory updates.
2. Order summary elements are printable and exportable.
3. Lead time records update automatically when shipments are logged.
