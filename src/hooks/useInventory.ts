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

      // Join with products and warehouses to get readable names and categories
      const { data, error: fetchError } = await supabase
        .from('inventory_balances')
        .select(`
          id,
          on_hand_qty,
          safety_stock_qty,
          products (
            name,
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

      // Map the database rows to the frontend camelCase interface
      const mappedInventory: LiveStockItem[] = (data || []).map((row: any) => {
        const qty = Number(row.on_hand_qty);
        const safety = Number(row.safety_stock_qty);
        
        // Compute dynamic status based on current stock vs reorder level
        let status: "Optimal" | "Low Stock" | "Critical" | "Transit" = "Optimal";
        if (qty <= 0) {
          status = "Critical";
        } else if (qty <= safety) {
          status = "Low Stock";
        }

        return {
          id: row.id,
          name: row.products?.name || 'Unknown Product',
          sku: row.products?.sku || 'N/A',
          sector: row.products?.category || 'Uncategorized',
          qty: qty,
          warehouse: row.warehouses?.name || 'Unknown Warehouse',
          status: status,
        };
      });

      // Sort alphabetically by product name for consistency
      mappedInventory.sort((a, b) => a.name.localeCompare(b.name));

      setInventory(mappedInventory);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory');
      console.error('[useInventory] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch immediately on mount
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    refreshInventory: fetchInventory,
    setInventory // Provided for optimistic UI updates in the component
  };
}
