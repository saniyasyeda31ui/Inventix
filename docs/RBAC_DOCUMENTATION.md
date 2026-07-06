# Role-Based Access Control (RBAC) Documentation

Security in Inventix ERP is enforced across two layers:
1. **Frontend UI Tier:** Component rendering, route guards, and button states controlled via `src/lib/rbac.ts`.
2. **Backend Database Tier:** Strict PostgreSQL Row-Level Security (RLS) policies defined in `supabase/migrations`.

## Authentication Flow
1. User logs in via Email/Password using Supabase Auth (`LoginPage.tsx`).
2. Supabase issues a JWT session token.
3. On first login, a database trigger automatically duplicates the `auth.users` row into the `public.profiles` table to maintain custom metadata (`role`, `organization`).
4. The `AuthContext` retrieves the user's Profile from the database and maps the Postgres Role to an Internal App Role using the `mapDatabaseRoleToAppRole` utility.

## Application Roles & Capabilities

The system defines 6 primary roles:

### 1. Admin (`admin` / DB: `manager`)
- **Description:** Highest privilege level. Complete system override.
- **Access:** All Modules (Vendors, Products, Orders, Warehouses, Finance, Employees, Settings).
- **Mutations:** Full CRUD capability across all tables. Ability to configure system settings and manage other employees.

### 2. Procurement Manager (`procurement_manager` / DB: `sourcing_admin`)
- **Description:** Oversees vendor relations and purchasing workflows.
- **Access:** Vendors, Purchase Requests, Purchase Orders, Reports, AI Insights.
- **Mutations:** Can Add/Edit/Delete Vendors, Manage Purchase Requests, and Dispatch Purchase Orders.

### 3. Inventory Manager (`inventory_manager`)
- **Description:** Oversees corporate material catalog and stock definitions.
- **Access:** Products, Warehouses, Inventory, Reports, AI Insights.
- **Mutations:** Can modify the central Product catalog, Add/Edit Warehouses, and adjust core stock levels.

### 4. Warehouse Manager (`warehouse_manager`)
- **Description:** Local physical fulfillment operator.
- **Access:** Warehouses, Inventory, Reports, AI Insights.
- **Mutations:** Can adjust stock levels (receive/audit inventory), but *cannot* create new Warehouses or modify the core Product catalog.

### 5. Finance Manager (`finance_manager`)
- **Description:** Handles accounts payable and ledger auditing.
- **Access:** Payments, Purchase Orders, Reports.
- **Mutations:** Can record payments, update invoice statuses, and view Purchase Order amounts.

### 6. Viewer (`viewer`)
- **Description:** Default read-only role assigned to new signups.
- **Access:** Dashboard, Reports, AI Insights.
- **Mutations:** Read-only access. Cannot modify any system data.

## Row Level Security (RLS) Policies
PostgreSQL enforces the ultimate security perimeter. Even if a user bypasses the frontend UI, RLS ensures unauthorized queries fail.

- **Authentication Check:** Nearly all tables require `to authenticated`.
- **Role Helper Functions:** SQL Security Definer functions like `public.is_manager()` evaluate the user's role securely against their JWT `auth.uid()`.
- **Policy Examples:**
  - `products`: Any authenticated user can *Select*. Only users where `is_admin_or_manager()` returns true can *Insert/Update/Delete*.
  - `purchase_requests`: Any user can *Insert*. A Requestor can *Update* their own request if it is still 'Pending'. Only `manager` roles can *Approve/Reject* or *Delete*.

## UI Permission Enforcement
Components conditionally render interactive elements using the `Permissions` object mapped from the active role.

```tsx
// Example usage in a Component
import { useAuth } from '../context/AuthContext';

export function DeleteProductButton({ productId }) {
  const { permissions } = useAuth();
  
  if (!permissions.canManageProducts) {
    return null; // or disabled button
  }
  
  return <button onClick={handleDelete}>Delete</button>;
}
```
