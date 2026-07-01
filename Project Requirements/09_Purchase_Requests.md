# Module Requirements: Purchase Requests

## 1. Business Requirements
The Purchase Requests (PR) module serves as the primary system entry point for internal procurement creation. This module manages material draft submissions, cost assessments, department validation routing, and approvals.
- Enable operations personnel to request inventory components.
- Direct all pending requests to authorized department heads for approval.

## 2. User Stories
- **As a Logistics Specialist,** I want to submit a purchase request for steel fasteners so that my team can keep our assembly floor operational.
- **As a Sourcing Manager,** I want to review pending requests and approve them so that the system issues valid purchase orders.

## 3. Validations
- **Draft Boundaries:** Quantity parameters must scale above 0.
- **Cost Calculations:** Estimated costs must automatically calculate by multiplying the item catalog rate by request quantities.

## 4. Edge Cases
- **Over-budget Request Submission:** Requests that exceed department budgets must trigger automatic warnings or auto-reroute to finance managers.
- **Concurrent Approvals:** Simultaneous approval clicks on the same purchase request must resolve without duplicate transaction logs.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.purchase_requests (
  id text not null primary key, -- PR-2026-001
  product_name text not null,
  quantity integer not null,
  estimated_cost numeric(12,2) not null,
  requestor text not null,
  department text not null,
  status text not null default 'Pending', -- 'Pending', 'Approved', 'Rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/purchase-requests` (Retrieves lists filtered by status).
- `POST /api/purchase-requests` (Logs new purchase draft records).
- `PATCH /api/purchase-requests/:id/approve` (Updates state values to Approved).

## 7. UI Dependencies
- Modal interfaces to create and draft purchase orders.
- Dynamic toast panels declaring "Purchase Request forwarded for manager review."

## 8. Acceptance Criteria
1. Draft values calculate total costs accurately in real time.
2. Block Sourcing view from selecting negative request quantities.
3. Status changes update database states instantly.
