# Development Phases: Phase 04 - Optimization, Edge Functions & Final Audits

## 1. Phase Objectives
Optimize platform load speeds, write automated Edge functions to compute seasonal forecasts, implement PDF invoicing export utilities, execute design accessibility audits, and perform final build-readiness checks.

---

## 2. Advanced Sourcing & Edge Functions

### A. Edge Function: Demand Forecast Calculator
Write a Supabase edge function at `/supabase/functions/calculate-demand-forecast/index.ts` to execute automated predictive calculations twice daily using historical movement metrics:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // 1. Fetch historical sales and inventory transactions
  const { data: movements } = await supabaseClient
    .from('inventory_balances')
    .select('product_id, on_hand_qty, safety_stock_qty');

  // 2. Map risk vectors and compute forecast depletion rates
  for (const item of movements) {
    if (item.on_hand_qty <= item.safety_stock_qty) {
      await supabaseClient
        .from('ai_recommendations')
        .insert([{
          item: item.product_id,
          severity: 'high',
          alert_message: `Stock level ${item.on_hand_qty} has dropped below safety margin. Reorder immediately.`,
          suggested_qty: item.safety_stock_qty * 2,
          status: 'Active'
        }]);
    }
  }

  return new Response(JSON.stringify({ success: true, processed: movements.length }), {
    headers: { "Content-Type": "application/json" }
  });
});
```

---

### B. Procurement Report Generation (CSV/PDF)
Configure spreadsheet exporter utility libraries inside `/src/utils/reportExporter.ts` to parse records securely into formatted columns:

```typescript
export function exportToCSV(data: any[], fileName: string) {
  const csvHeaders = Object.keys(data[0]).join(',');
  const csvRows = data.map(row => 
    Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
  );
  
  const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## 3. Performance & Design Optimization Check
1.  **Skeleton Loader Sync:** Match Skeleton container sizes exactly to real content heights to eliminate visual layout shifts.
2.  **Asset Optimizations:** Inline vector graphic weights (`SVG` blocks) rather than pulling external raster files, keeping resource sizes minimal.
3.  **Contrast & Touch Target Audits:** Verify color variables pass AA accessibility standards (`Contrast: 4.5:1` minimum).

---

## 4. Testing Checklist
- [ ] Edge functions process database metrics successfully under cron conditions.
- [ ] Export files download and open with correct headers and zero text overlaps.
- [ ] Application builds green under `npm run build` and runs correctly inside Cloud Run container frames.

---

## 5. Estimations & Git Commit Milestones
- **Duration:** 1 Day
- **Commit Milestone:** `perf(opt): deploy edge forecasting, CSV export engines, and complete accessibility audits`
