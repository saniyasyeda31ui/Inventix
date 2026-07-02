/**
 * src/hooks/usePurchaseRequests.ts
 *
 * Custom hook to manage fetching and state of the Purchase Requests.
 * Replaces mock datasets with live Supabase queries from public.purchase_requests.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PurchaseRequest } from '../data/dashboardData';

export function usePurchaseRequests() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Join with products and profiles to get the most up-to-date names if available,
      // falling back to the denormalized text columns in purchase_requests.
      const { data, error: fetchError } = await supabase
        .from('purchase_requests')
        .select(`
          id,
          requestor,
          department,
          supplier,
          expected_delivery,
          priority,
          status,
          estimated_cost,
          product_name,
          products ( name ),
          requestorProfile:profiles!requestor_id ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedRequests: PurchaseRequest[] = (data || []).map((row: any) => {
        // Format the currency to match the mock data string format (e.g., "$12,500")
        const cost = Number(row.estimated_cost);
        const formattedCost = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(cost);

        // Fallback to joined tables if the denormalized column is somehow missing
        const itemName = row.products?.name || row.product_name || 'Unknown Item';
        const requestorName = row.requestorProfile?.full_name || row.requestor || 'Unknown Requestor';

        return {
          id: row.id,
          requestedBy: requestorName,
          department: row.department || 'General',
          supplier: row.supplier || 'TBD',
          expectedDelivery: row.expected_delivery || 'TBD',
          priority: row.priority,
          status: row.status,
          amount: formattedCost,
          item: itemName,
        };
      });

      setPurchaseRequests(mappedRequests);
    } catch (err: any) {
      setError(err.message || 'Failed to load purchase requests');
      console.error('[usePurchaseRequests] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseRequests();
  }, [fetchPurchaseRequests]);

  return {
    purchaseRequests,
    loading,
    error,
    refreshPurchaseRequests: fetchPurchaseRequests,
    setPurchaseRequests // For optimistic UI updates
  };
}
