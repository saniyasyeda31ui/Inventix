/**
 * src/hooks/usePurchaseOrders.ts
 *
 * Custom hook to manage fetching and state of the Purchase Orders.
 * Replaces mock datasets with live Supabase queries from public.purchase_orders.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PurchaseOrder } from '../data/dashboardData';
import { useAuth } from '../context/AuthContext';

export function usePurchaseOrders() {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('purchase_orders')
        .select(`
          id,
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
        const cost = Number(row.total_amount);
        const formattedCost = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(cost);

        const createdDate = row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'TBD';
        const deliveryDate = row.promised_date ? new Date(row.promised_date).toISOString().split('T')[0] : 'TBD';

        const vendorName = row.vendors?.name || 'Unknown Vendor';
        const buyerName = row.buyerProfile?.full_name || row.buyer || 'Unknown Buyer';

        return {
          id: row.po_number,
          uuid: row.id,
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

  const addPurchaseOrder = async (orderData: any) => {
    const tempPoNum = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const dbPayload = {
      po_number: tempPoNum,
      vendor_id: orderData.vendor_id,
      purchase_request_id: orderData.purchase_request_id || null,
      total_amount: orderData.total_amount || 0,
      items_count: orderData.itemsCount || 0,
      status: orderData.status || 'Draft',
      promised_date: orderData.deliveryDate || null,
      buyer: user?.email || 'Unknown Buyer',
      created_by: user?.id || null
    };

    const formattedCost = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(dbPayload.total_amount);

    const optimisticOrder: PurchaseOrder = {
      id: dbPayload.po_number,
      vendorName: 'Loading...',
      amount: formattedCost,
      dateCreated: new Date().toISOString().split('T')[0],
      deliveryDate: dbPayload.promised_date || 'TBD',
      status: dbPayload.status as any,
      itemsCount: dbPayload.items_count,
      buyer: dbPayload.buyer
    };

    setPurchaseOrders(prev => [optimisticOrder, ...prev]);

    try {
      const { data, error: insertError } = await supabase
        .from('purchase_orders')
        .insert([dbPayload])
        .select('id, po_number')
        .single();

      if (insertError) throw new Error(insertError.message);
      
      // Update UUIDs to avoid flicker on immediate edit/delete
      setPurchaseOrders(prev => prev.map(o => o.id === tempPoNum ? { ...o, uuid: data.id, id: data.po_number } : o));
      fetchPurchaseOrders();
    } catch (err: any) {
      setPurchaseOrders(prev => prev.filter(o => o.id !== tempPoNum)); // rollback
      throw err;
    }
  };

  const updatePurchaseOrder = async (uuid: string, updates: any) => {
    const orderToUpdate = purchaseOrders.find(o => o.uuid === uuid);
    if (!orderToUpdate) throw new Error("Purchase order not found or missing UUID");

    const previousOrders = [...purchaseOrders];
    const optimisticUpdated = { ...orderToUpdate, ...updates };
    setPurchaseOrders(prev => prev.map(o => o.uuid === uuid ? optimisticUpdated : o));

    try {
      const dbPayload: any = {};
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.vendor_id !== undefined) dbPayload.vendor_id = updates.vendor_id;
      if (updates.purchase_request_id !== undefined) dbPayload.purchase_request_id = updates.purchase_request_id;
      if (updates.total_amount !== undefined) dbPayload.total_amount = updates.total_amount;
      if (updates.itemsCount !== undefined) dbPayload.items_count = updates.itemsCount;
      if (updates.deliveryDate !== undefined) dbPayload.promised_date = updates.deliveryDate;

      const { error: updateError } = await supabase
        .from('purchase_orders')
        .update(dbPayload)
        .eq('id', orderToUpdate.uuid);

      if (updateError) throw new Error(updateError.message);
      
      // If we updated relations, fetch again to resolve names
      if (updates.vendor_id) fetchPurchaseOrders();
    } catch (err: any) {
      setPurchaseOrders(previousOrders);
      throw err;
    }
  };

  const deletePurchaseOrder = async (uuid: string) => {
    const orderToDelete = purchaseOrders.find(o => o.uuid === uuid);
    if (!orderToDelete) throw new Error("Purchase order not found or missing UUID");

    const previousOrders = [...purchaseOrders];
    setPurchaseOrders(prev => prev.filter(o => o.uuid !== uuid));

    try {
      const { error: deleteError } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', orderToDelete.uuid);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setPurchaseOrders(previousOrders);
      throw err;
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  return {
    purchaseOrders,
    loading,
    error,
    refreshPurchaseOrders: fetchPurchaseOrders,
    setPurchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder
  };
}
