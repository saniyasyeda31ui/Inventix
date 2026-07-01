# Development Phases: Phase 03 - State Sync & CRUD Operations

## 1. Phase Objectives
Connect core ERP sections to the Supabase database. Implement real-time listener bindings to push stock alerts and activity logs instantly, while ensuring database-backed query variables handle sorting, searching, and paging safely.

---

## 2. Real-Time Telemetry & Operations

### A. Material Database Binding (`ProductsSection.tsx`)
Re-route the static inventory data model in `ProductsSection.tsx` to read directly from Supabase, applying server-side query parameters:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProducts({ search, category, status, sortBy, sortOrder, page }) {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Search term filtering on SKU, Vendor, and Name
      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,primary_vendor.ilike.%${search}%`);
      }

      // Filter selections
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (status && status !== 'All') {
        query = query.eq('stock_status', status);
      }

      // Query sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Pagination setup (limit: 10 items)
      const from = (page - 1) * 10;
      const to = from + 9;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        setProducts(data);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [search, category, status, sortBy, sortOrder, page]);

  return { products, totalCount, loading };
}
```

---

### B. Purchase Request Approvals Workflow (`PurchaseRequests.tsx`)
Connect the purchase request routing flows, ensuring proper permissions logic executes safely:

1.  **Creation Drafts:** Users input quantities, and calculations execute instantly. Submitting pushes a row insert to the database:
    ```typescript
    const { error } = await supabase
      .from('purchase_requests')
      .insert([{
        product_name: productName,
        quantity,
        estimated_cost: cost,
        requestor: profile?.full_name,
        department: profile?.organization,
        status: 'Pending'
      }]);
    ```
2.  **Manager Approval Operations:** Managers click "Approve" which patches statuses safely and triggers corresponding inventory receipts:
    ```typescript
    const { error } = await supabase
      .from('purchase_requests')
      .update({ status: 'Approved' })
      .eq('id', requestId);
    ```

---

### C. Sockets & Real-time Alerts Listener
Configure live channels inside `/src/components/AlertsDrawer.tsx` to trigger notifications on low-stock events automatically:

```typescript
useEffect(() => {
  const notificationChannel = supabase
    .channel('realtime_alerts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
      // Feed updates instantly
      setNotifications(prev => [payload.new, ...prev]);
      showToast(payload.new.title, 'info');
    })
    .subscribe();

  return () => {
    supabase.removeChannel(notificationChannel);
  };
}, []);
```

---

## 3. Testing Checklist
- [ ] Table headers, search text highlights, and column ordering match query bounds accurately.
- [ ] Submitting purchase requests populates the admin ledger rows.
- [ ] Real-time database changes broadcast events safely across connected terminals.

---

## 4. Estimations & Git Commit Milestones
- **Duration:** 2-3 Days
- **Commit Milestone:** `feat(sync): replace mock lists with active supabase queries and socket telemetry channels`
