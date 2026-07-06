/**
 * src/hooks/useInventory.ts
 *
 * Custom hook to manage fetching and state of the Inventory balances.
 * Replaces mock datasets with live Supabase queries from public.inventory_balances.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { LiveStockItem } from '../data/dashboardData';

export function useInventory() {
  const [inventory, setInventory] = useState<LiveStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('inventory_balances')
        .select(`
          id,
          on_hand_qty,
          safety_stock_qty,
          products (
            product_name,
            sku,
            category
          ),
          warehouses (
            name
          )
        `);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedInventory: LiveStockItem[] = (data || []).map((row: any) => {
        const qty = Number(row.on_hand_qty);
        const safety = Number(row.safety_stock_qty);
        
        let status: "Optimal" | "Low Stock" | "Critical" | "Transit" = "Optimal";
        if (qty <= 0) {
          status = "Critical";
        } else if (qty <= safety) {
          status = "Low Stock";
        }

        return {
          id: row.id,
          name: row.products?.product_name || 'Unknown Product',
          sku: row.products?.sku || 'N/A',
          sector: row.products?.category || 'Uncategorized',
          qty: qty,
          warehouse: row.warehouses?.name || 'Unknown Warehouse',
          status: status,
        };
      });

      mappedInventory.sort((a, b) => a.name.localeCompare(b.name));

      setInventory(mappedInventory);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory');
      console.error('[useInventory] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addInventory = async (productId: string, warehouseId: string, qtyToAdd: number, safetyStockQty: number) => {
    // Generate a temporary ID for optimistic UI
    const tempId = `temp-inv-${Math.random().toString(36).substr(2, 9)}`;

    // Create a generic optimistic item (we don't have product/warehouse names here easily without fetching)
    const optimisticItem: LiveStockItem = {
      id: tempId,
      name: 'Loading...',
      sku: '...',
      sector: '...',
      qty: qtyToAdd,
      warehouse: 'Loading...',
      status: qtyToAdd <= 0 ? "Critical" : (qtyToAdd <= safetyStockQty ? "Low Stock" : "Optimal")
    };

    setInventory(prev => [...prev, optimisticItem]);

    try {
      const { data, error: insertError } = await supabase
        .from('inventory_balances')
        .insert([{
          product_id: productId,
          warehouse_id: warehouseId,
          on_hand_qty: qtyToAdd,
          safety_stock_qty: safetyStockQty,
          allocated_qty: 0
        }])
        .select(`
          id,
          on_hand_qty,
          safety_stock_qty,
          products ( product_name, sku, category ),
          warehouses ( name )
        `)
        .single();

      if (insertError) throw new Error(insertError.message);

      // Re-map the returned data to update the optimistic item with real names
      const qty = Number(data.on_hand_qty);
      const safety = Number(data.safety_stock_qty);
      let status: "Optimal" | "Low Stock" | "Critical" | "Transit" = "Optimal";
      if (qty <= 0) status = "Critical";
      else if (qty <= safety) status = "Low Stock";

      const products: any = data.products || {};
      const warehouses: any = data.warehouses || {};

      const realItem: LiveStockItem = {
        id: data.id,
        name: products.product_name || 'Unknown Product',
        sku: products.sku || 'N/A',
        sector: products.category || 'Uncategorized',
        qty: qty,
        warehouse: warehouses.name || 'Unknown Warehouse',
        status: status,
      };

      setInventory(prev => prev.map(item => item.id === tempId ? realItem : item));
      
      // We trigger a refresh to ensure sort order and full consistency, though realItem helps avoid flicker
      fetchInventory();
    } catch (err: any) {
      setInventory(prev => prev.filter(item => item.id !== tempId));
      throw err;
    }
  };

  const updateInventory = async (id: string, updates: any) => {
    const itemToUpdate = inventory.find(i => i.id === id);
    if (!itemToUpdate) throw new Error("Inventory record not found");

    const previousInventory = [...inventory];
    
    // Calculate new status if qty is updated
    let optimisticStatus = itemToUpdate.status;
    if (updates.on_hand_qty !== undefined) {
      // In a real app we'd need safety_stock_qty to calculate properly.
      // We do a rough estimate or just keep the optimistic value until DB refresh.
      if (updates.on_hand_qty <= 0) optimisticStatus = "Critical";
    }

    const optimisticUpdated = { 
      ...itemToUpdate, 
      ...(updates.on_hand_qty !== undefined && { qty: updates.on_hand_qty }),
      status: optimisticStatus
    };
    
    setInventory(prev => prev.map(i => i.id === id ? optimisticUpdated : i));

    try {
      const { error: updateError } = await supabase
        .from('inventory_balances')
        .update(updates)
        .eq('id', id);

      if (updateError) throw new Error(updateError.message);
      
      // Refresh to get accurate status based on actual safety_stock_qty
      fetchInventory();
    } catch (err: any) {
      setInventory(previousInventory);
      throw err;
    }
  };

  const deleteInventory = async (id: string) => {
    const previousInventory = [...inventory];
    setInventory(prev => prev.filter(i => i.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('inventory_balances')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setInventory(previousInventory);
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    refreshInventory: fetchInventory,
    setInventory,
    addInventory,
    updateInventory,
    deleteInventory
  };
}
