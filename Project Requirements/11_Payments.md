# Module Requirements: Payments

## 1. Business Requirements
The Payments module is the financial ledger of the procurement pipeline, managing accounts payable, payment terms, and matching invoices to POs and receiving slips.
- Facilitate matching between invoices, POs, and receiving logs.
- Streamline accounting pipelines to prevent supplier payment delays.

## 2. User Stories
- **As a Financial Auditor,** I want to match invoice numbers to verify payment limits before initiating transactions.
- **As a Sourcing Administrator,** I want to track which supplier invoices are approaching Net 30 boundaries so that we avoid penalties.

## 3. Validations
- **ledger Amounts:** Ledger transaction totals must equal confirmed PO costs.
- **Ledger References:** Payment entries must link directly to verified purchase orders and invoices.

## 4. Edge Cases
- **Duplicate Invoices:** Flag duplicates matching identical cost levels and transaction reference codes instantly.
- **Disputed Shipments:** If deliveries are logged as defective, system must hold active payments automatically.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  purchase_order_id uuid references public.purchase_orders(id) not null,
  amount_paid numeric(12,2) not null,
  payment_method text not null, -- 'ACH', 'Wire', 'Check'
  status text not null default 'Unpaid', -- 'Unpaid', 'Pending', 'Paid', 'Disputed'
  due_date date not null,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/payments` (Retrieves matching invoices and ledger histories).
- `POST /api/payments/pay` (Records active ACH transfers or check updates).

## 7. UI Dependencies
- Visual badges highlighting payments approaching Net 30 deadlines.
- Detailed transaction ledgers displaying invoice statuses.

## 8. Acceptance Criteria
1. Disputed orders hold payment status changes automatically.
2. Invoices validate payment totals against purchase boundaries.
3. Access is restricted strictly to accounts payable managers.
