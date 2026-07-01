# Module Requirements: Roles & Permissions

## 1. Business Requirements
Inventix ERP relies on strict Role-Based Access Control (RBAC) to ensure structural separation of concerns. Access permissions regulate what elements can be read, written, updated, or deleted based on organizational tiers.
- Protect critical financial details, supplier performance indices, and procurement budgets from unqualified viewers.
- Support hierarchy tiers: `viewer`, `sourcing_admin`, `manager`.

## 2. User Stories
- **As an Alexander S. (Lead Sourcing Admin),** I want to view active supplier indices and create purchase requests, but not arbitrarily approve my own PO budgets.
- **As a Manager,** I want to view, reject, or approve purchase requests from my team to maintain budget compliance.
- **As a Viewer,** I want to read stock levels, but be blocked from adding new items or updating price agreements.

## 3. Validations
- **Role Identity:** Roles must be mapped inside profiles database tables and JWT claims.
- **Action Guard:** Frontend action buttons must verify permissions prior to execution.

## 4. Edge Cases
- **Session Hijacking / Payload Editing:** API route middleware must execute Row-Level Security (RLS) policies directly on PostgreSQL tables rather than relying solely on frontend hides.
- **Role De-escalation:** If an admin de-escalates a user's role, the active session token must immediately revoke access on the subsequent API query.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
-- Role claims integrated directly into profiles or user metadata
alter table public.profiles add column role text not null default 'viewer';
```

## 6. API Requirements
- `GET /api/user/permissions` (Returns permissions mapping array for active user).
- `POST /api/admin/change-role` (Body: `{ userId, targetRole }` -> Restricted strictly to managers).

## 7. UI Dependencies
- Dynamic dashboard view filtering (hide buttons if permissions do not match).
- Restricted permission screen overlay fallback (403 Access Denied template).

## 8. Acceptance Criteria
1. Verified RLS policies prevent simple users from inserting rows into the `products` table.
2. Sourcing Admins can view administrative panels, while Viewers encounter restricted access warnings.
3. Navigation menu hides modules that are unauthorized for the logged-in role.
