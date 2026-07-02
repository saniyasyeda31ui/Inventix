/**
 * src/hooks/usePurchaseOrders.ts
 *
 * Custom hook to manage fetching and state of the Purchase Orders.
 * Replaces mock datasets with live Supabase queries from public.purchase_orders.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PurchaseOrder } from '../data/dashboardData';

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Join with vendors and profiles to get readable names.
      // Explicitly name the profiles relationship to avoid ambiguity, 
      // as there may be multiple FKs to profiles in the future or present.
      const { data, error: fetchError } = await supabase
        .from('purchase_orders')
        .select(`
          po_number,
          total_amount,
          created_at,
          promised_date,
          status,
          items_count,
          buyer,
          vendors ( name ),
          buyerProfile:profiles!created_by ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedOrders: PurchaseOrder[] = (data || []).map((row: any) => {
        // Format the currency to match the mock data string format (e.g., "$12,500")
        const cost = Number(row.total_amount);
        const formattedCost = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(cost);

        // Date formatting: YYYY-MM-DD to "Mon DD, YYYY" or similar based on mock data
        // Mock data uses format like "2026-07-02". We'll just slice the ISO string.
        const createdDate = row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'TBD';
        const deliveryDate = row.promised_date ? new Date(row.promised_date).toISOString().split('T')[0] : 'TBD';

        const vendorName = row.vendors?.name || 'Unknown Vendor';
        const buyerName = row.buyerProfile?.full_name || row.buyer || 'Unknown Buyer';

        return {
          id: row.po_number, // UI expects id to be the PO string like 'PO-2026-001'
          vendorName: vendorName,
          amount: formattedCost,
          dateCreated: createdDate,
          deliveryDate: deliveryDate,
          status: row.status,
          itemsCount: Number(row.items_count),
          buyer: buyerName,
        };
      });

      setPurchaseOrders(mappedOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to load purchase orders');
      console.error('[usePurchaseOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  return {
    purchaseOrders,
    loading,
    error,
    refreshPurchaseOrders: fetchPurchaseOrders,
    setPurchaseOrders // For optimistic UI updates
  };
}
