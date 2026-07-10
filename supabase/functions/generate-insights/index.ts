import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify authentication
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) throw new Error("Unauthorized");

    // Fetch live data scoped to this user/company via RLS
    const [invRes, whRes, vendorRes, poRes, prRes] = await Promise.all([
      supabaseClient.from('inventory_balances').select('product_id, on_hand_qty, safety_stock_qty, products(id, name, unit_price, stock_status)'),
      supabaseClient.from('warehouses').select('name, max_cubic_capacity, current_occupancy_pct'),
      supabaseClient.from('vendors').select('id, name, score, status').eq('status', 'Active'),
      supabaseClient.from('purchase_orders').select('id, status, vendorName, promised_date, total_amount')
        .not('status', 'in', '("Completed","Cancelled")'),
      supabaseClient.from('purchase_requests').select('id, status, item, amount, quantity, product_id, supplier').eq('status', 'Pending')
    ]);

    const recommendations = [];
    
    // 1. Low Stock & Overstock & Inventory Valuation
    if (invRes.data) {
      for (const inv of invRes.data) {
        const qty = Number(inv.on_hand_qty) || 0;
        const safety = Number(inv.safety_stock_qty) || 0;
        const productInfo = inv.products as any;
        const price = Number(productInfo?.unit_price) || 0;
        const itemName = productInfo?.name || 'Unknown Item';
        const productId = inv.product_id;

        // Inventory valuation / Tied up capital
        const valuation = qty * price;

        if (qty <= safety) {
          const suggestedQty = safety === 0 ? 100 : (safety * 2) - qty;
          const bestVendor = vendorRes.data?.sort((a, b) => b.score - a.score)[0]?.name || 'Primary Vendor';
          
          recommendations.push({
            item: itemName,
            severity: 'high',
            alert_message: `Low Stock: Current quantity (${qty}) is at or below the safety threshold (${safety}). Action required to prevent stockout.`,
            suggested_qty: suggestedQty > 0 ? suggestedQty : 10,
            alternative_supplier: bestVendor,
            estimated_savings: 0,
            status: 'Active'
          });
        } else if (qty > safety * 3 && safety > 0) {
          // Overstock
          const excess = qty - (safety * 2);
          const tiedCapital = excess * price;
          if (tiedCapital > 500) {
            recommendations.push({
              item: itemName,
              severity: 'medium',
              alert_message: `Overstock: ${excess} excess units detected. Liquidating or halting orders can free up capital.`,
              suggested_qty: Math.max(1, Math.floor(excess * 0.5)),
              alternative_supplier: "Overstock (Action: Inventory)",
              estimated_savings: tiedCapital,
              status: 'Active'
            });
          }
        }
      }
    }

    // 2. Warehouse Utilization
    if (whRes.data) {
      for (const wh of whRes.data) {
        const util = Number(wh.current_occupancy_pct) || 0;
        if (util >= 90) {
          recommendations.push({
            item: `${wh.name}`,
            severity: 'high',
            alert_message: `Warehouse Utilization: ${wh.name} is near maximum capacity (${util}%). Consider rerouting inbound shipments.`,
            suggested_qty: 1, // DUMMY VALUE
            alternative_supplier: "Warehouse (Action: Warehouse)",
            estimated_savings: 0,
            status: 'Active'
          });
        }
      }
    }

    // 3. Vendor Performance
    if (vendorRes.data) {
      for (const v of vendorRes.data) {
        if (Number(v.score) < 70) {
          recommendations.push({
            item: v.name,
            severity: 'medium',
            alert_message: `Vendor Performance: ${v.name} has dropped below the acceptable threshold (Score: ${v.score}). Prepare alternative sourcing.`,
            suggested_qty: 1,
            alternative_supplier: "Vendor (Action: Vendor)",
            estimated_savings: 0,
            status: 'Active'
          });
        }
      }
    }

    // 4. Overdue Purchase Orders & Spending Trends
    if (poRes.data) {
      const today = new Date();
      let totalPendingSpend = 0;
      
      for (const po of poRes.data) {
        totalPendingSpend += Number(po.total_amount) || 0;
        
        if (po.promised_date && new Date(po.promised_date) < today && po.status !== 'Completed') {
          recommendations.push({
            item: `PO: ${po.vendorName}`,
            severity: 'high',
            alert_message: `Overdue PO: Purchase order from ${po.vendorName} is past its promised delivery date (${po.promised_date}).`,
            suggested_qty: 1,
            alternative_supplier: "Order (Action: PO)",
            estimated_savings: 0,
            status: 'Active'
          });
        }
      }
      
      // Spending trend alert if pending spend is very high
      if (totalPendingSpend > 100000) {
         recommendations.push({
            item: `Pending PO Spend`,
            severity: 'medium',
            alert_message: `Spending Trend: High volume of capital ($${totalPendingSpend.toLocaleString()}) locked in active POs. Ensure healthy cash flow.`,
            suggested_qty: 1,
            alternative_supplier: "Trend (Action: Spend)",
            estimated_savings: totalPendingSpend * 0.05, // estimated 5% savings from renegotiation
            status: 'Active'
          });
      }
    }

    // 5. Pending Purchase Requests
    if (prRes.data && prRes.data.length > 5) {
      // If there are many pending PRs, it's a bottleneck
      recommendations.push({
        item: `Pending Requests`,
        severity: 'low',
        alert_message: `Pending PRs: You have ${prRes.data.length} pending Purchase Requests requiring approval. Resolving them optimizes lead times.`,
        suggested_qty: prRes.data.length,
        alternative_supplier: "Requests (Action: PR)",
        estimated_savings: 0,
        status: 'Active'
      });
    }

    // Clean up old recommendations (only affects the user's tenant rows due to RLS)
    const { error: delError } = await supabaseClient.from('ai_recommendations').delete().eq('status', 'Active');
    if (delError) console.error("Error deleting old recs:", delError);

    // Insert new recommendations if any
    let insertedRecs = [];
    if (recommendations.length > 0) {
      const { data, error: insError } = await supabaseClient.from('ai_recommendations')
        .insert(recommendations)
        .select('*');
        
      if (insError) {
        console.error("Error inserting recommendations:", insError);
        throw insError;
      }
      insertedRecs = data;
    }

    return new Response(JSON.stringify({ success: true, count: insertedRecs.length, data: insertedRecs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("AI Insight Gen Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
