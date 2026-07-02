/**
 * src/hooks/useWarehouses.ts
 *
 * Custom hook to manage fetching and state of the Warehouses directory.
 * Replaces mock datasets with live Supabase queries from public.warehouses.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { WarehouseItem } from '../data/dashboardData';

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // We join the employees table to get the manager's full name.
      const { data, error: fetchError } = await supabase
        .from('warehouses')
        .select(`
          *,
          employees (
            full_name
          )
        `)
        .order('name');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Map the database snake_case columns to the frontend camelCase interface
      const mappedWarehouses: WarehouseItem[] = (data || []).map((row: any) => ({
        id: row.code, // Map DB text code ('WH-001') to frontend id
        name: row.name,
        location: row.location,
        manager: row.employees?.full_name || 'Unassigned',
        capacityUsed: Number(row.current_occupancy_pct),
        totalAreaSqFt: Number(row.max_cubic_capacity), // Note: max_cubic_capacity acts as area footprint in UI
        status: row.status,
      }));

      setWarehouses(mappedWarehouses);
    } catch (err: any) {
      setError(err.message || 'Failed to load warehouses');
      console.error('[useWarehouses] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch immediately on mount
  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  return {
    warehouses,
    loading,
    error,
    refreshWarehouses: fetchWarehouses,
    setWarehouses // Provided for optimistic UI updates in the component
  };
}
