/**
 * src/hooks/usePurchaseRequests.ts
 *
 * Custom hook to manage fetching and state of the Purchase Requests.
 * Replaces mock datasets with live Supabase queries from public.purchase_requests.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PurchaseRequest } from '../data/dashboardData';
import { useAuth } from '../context/AuthContext';

export function usePurchaseRequests() {
  const { user } = useAuth();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
        const cost = Number(row.estimated_cost);
        const formattedCost = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(cost);

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

  const addPurchaseRequest = async (requestData: any) => {
    const tempId = `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const dbPayload = {
      id: tempId,
      product_name: requestData.item || 'Unknown Product',
      product_id: requestData.product_id || null,
      quantity: requestData.quantity || 1,
      estimated_cost: requestData.estimated_cost || 0,
      requestor: user?.email || 'Unknown Requestor',
      requestor_id: user?.id || null,
      department: requestData.department || 'General',
      priority: requestData.priority || 'Medium',
      expected_delivery: requestData.expectedDelivery || null,
      supplier: requestData.supplier || null,
      status: 'Pending'
    };

    const formattedCost = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(dbPayload.estimated_cost);

    const optimisticRequest: PurchaseRequest = {
      id: dbPayload.id,
      requestedBy: dbPayload.requestor,
      department: dbPayload.department,
      supplier: dbPayload.supplier || 'TBD',
      expectedDelivery: dbPayload.expected_delivery || 'TBD',
      priority: dbPayload.priority as any,
      status: 'Pending',
      amount: formattedCost,
      item: dbPayload.product_name
    };

    setPurchaseRequests(prev => [optimisticRequest, ...prev]);

    try {
      const { error: insertError } = await supabase
        .from('purchase_requests')
        .insert([dbPayload]);

      if (insertError) throw new Error(insertError.message);
      
      fetchPurchaseRequests();
    } catch (err: any) {
      setPurchaseRequests(prev => prev.filter(r => r.id !== optimisticRequest.id));
      throw err;
    }
  };

  const updatePurchaseRequest = async (id: string, updates: any) => {
    const requestToUpdate = purchaseRequests.find(r => r.id === id);
    if (!requestToUpdate) throw new Error("Purchase request not found");

    const previousRequests = [...purchaseRequests];
    const optimisticUpdated = { ...requestToUpdate, ...updates };
    setPurchaseRequests(prev => prev.map(r => r.id === id ? optimisticUpdated : r));

    try {
      const dbPayload: any = {};
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.priority !== undefined) dbPayload.priority = updates.priority;
      if (updates.expectedDelivery !== undefined) dbPayload.expected_delivery = updates.expectedDelivery;

      const { error: updateError } = await supabase
        .from('purchase_requests')
        .update(dbPayload)
        .eq('id', id);

      if (updateError) throw new Error(updateError.message);
      fetchPurchaseRequests();
    } catch (err: any) {
      setPurchaseRequests(previousRequests);
      throw err;
    }
  };

  const deletePurchaseRequest = async (id: string) => {
    const previousRequests = [...purchaseRequests];
    setPurchaseRequests(prev => prev.filter(r => r.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('purchase_requests')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setPurchaseRequests(previousRequests);
      throw err;
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, [fetchPurchaseRequests]);

  return {
    purchaseRequests,
    loading,
    error,
    refreshPurchaseRequests: fetchPurchaseRequests,
    setPurchaseRequests,
    addPurchaseRequest,
    updatePurchaseRequest,
    deletePurchaseRequest
  };
}
