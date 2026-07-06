# API & Data Access Documentation

Inventix ERP uses a Backend-as-a-Service (BaaS) model via **Supabase**. The "API" layer consists of custom React Hooks that wrap the Supabase JavaScript Client (`@supabase/supabase-js`). These hooks manage data fetching, state caching, optimistic UI updates, and real-time subscription bindings.

## 1. Supabase Client Configuration
The application initializes a singleton Supabase client in `src/lib/supabase.ts`.

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 2. Core Data Hooks (CRUD & Realtime)

The following React Hooks encapsulate all database interactions. They typically export `data`, `loading`, `error`, and various mutation functions.

### `useProducts()`
- **Purpose:** Manages the material catalog (`products` table).
- **Functions:**
  - `fetchProducts()`: Retrieves all products.
  - `addProduct(product)`: Inserts a new SKU.
  - `updateProduct(id, updates)`: Modifies existing product fields.
  - `deleteProduct(id)`: Removes a product.

### `useInventory()`
- **Purpose:** Manages live physical stock ledgers (`inventory_balances` table).
- **Functions:**
  - `fetchInventory()`: Retrieves warehouse-product combinations.
  - `adjustStock(id, newQty)`: Updates `on_hand_qty`.

### `useWarehouses()`
- **Purpose:** Manages fulfilment center data (`warehouses` table).
- **Functions:**
  - Standard CRUD array mapped to warehouse operations.

### `usePurchaseRequests()`
- **Purpose:** Manages internal procurement workflows (`purchase_requests` table).
- **Functions:**
  - `createRequest(payload)`: Inserts a new draft.
  - `approveRequest(id)`: Updates status to 'Approved' (Requires Manager Role).
  - `rejectRequest(id)`: Updates status to 'Rejected'.

### `usePurchaseOrders()`
- **Purpose:** Formal vendor contracts (`purchase_orders` table).
- **Functions:**
  - `convertToPO(purchaseRequestId)`: Generates a PO from a request.
  - `updatePOStatus(id, status)`: Transitions PO state (Draft -> Sent -> Received).

### `usePayments()`
- **Purpose:** Accounts Payable tracking (`payments` table).
- **Functions:**
  - `recordPayment(poId, amount, method)`: Inserts a payment record.

### `useVendors()`
- **Purpose:** Supplier management (`vendors` table).
- **Functions:**
  - `addVendor(payload)`, `updateVendor(id)`, `deleteVendor(id)`.

### `useEmployees()`
- **Purpose:** Organizational personnel directory (`employees` table).
- **Functions:**
  - Fetch and manage employee reporting structures.

### `useNotifications()`
- **Purpose:** Manages system alerts and real-time drawer updates.
- **Functions:**
  - `markAsRead(id)`: Flags a notification as viewed.
  - Realtime subscription listens for internal `INSERT` events.

### `useDashboardMetrics()`
- **Purpose:** Aggregates top-level KPI metrics for the Dashboard Overview.
- **Operations:** Performs multi-table aggregations (Total Value, Active Vendors, Pending Orders, Low Stock Alerts).

### `useReports()`
- **Purpose:** Handles execution and persistence of custom query reports.
- **Functions:**
  - `saveReportConfig(config)`: Saves a user's filter preferences to `saved_reports`.

### `useAIRecommendations()`
- **Purpose:** Interfaces with the `ai_recommendations` table populated by predictive Edge Functions.
- **Functions:**
  - `dismissRecommendation(id)`: Ignores an AI suggestion.
  - `executeRecommendation(id)`: Triggers a corresponding workflow (e.g. creating a PO based on a suggestion).

## 3. Real-Time Telemetry
Supabase Postgres Changes (Realtime) are heavily utilized to avoid polling.
- **Activity Logs:** The Dashboard dashboard subscribes to `public.activity_logs` via `channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' })` to push live event toasts.
- **Notifications:** Subscribes to `public.notifications` to populate the bell icon badge.

## 4. Edge Functions (Deno)
Background processes or secure third-party integrations (like AI service calls) run on Supabase Edge Functions residing in `supabase/functions/`.
- *Status:* Currently under active implementation/migration from local mocks.
