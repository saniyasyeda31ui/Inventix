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
        uuid: row.id,
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

  const addWarehouse = async (warehouseData: any) => {
    const tempId = `WH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const dbPayload = {
      code: tempId,
      name: warehouseData.name,
      location: warehouseData.location,
      max_cubic_capacity: warehouseData.totalAreaSqFt,
      current_occupancy_pct: 0,
      status: 'Active'
    };

    const optimisticWarehouse: WarehouseItem = {
      id: dbPayload.code,
      name: dbPayload.name,
      location: dbPayload.location,
      totalAreaSqFt: dbPayload.max_cubic_capacity,
      capacityUsed: 0,
      manager: 'Unassigned',
      status: 'Active'
    };

    setWarehouses(prev => [...prev, optimisticWarehouse]);

    try {
      const { data, error: insertError } = await supabase
        .from('warehouses')
        .insert([dbPayload])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      
      setWarehouses(prev => prev.map(w => w.id === optimisticWarehouse.id ? { ...w, uuid: data.id, id: data.code } : w));
    } catch (err: any) {
      setWarehouses(prev => prev.filter(w => w.id !== optimisticWarehouse.id));
      throw err;
    }
  };

  const updateWarehouse = async (id: string, updates: any) => {
    const warehouseToUpdate = warehouses.find(w => w.id === id);
    if (!warehouseToUpdate || !warehouseToUpdate.uuid) throw new Error("Warehouse not found or missing UUID");

    const previousWarehouses = [...warehouses];
    const optimisticUpdated = { ...warehouseToUpdate, ...updates };
    setWarehouses(prev => prev.map(w => w.id === id ? optimisticUpdated : w));

    try {
      const dbPayload: any = {};
      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.location !== undefined) dbPayload.location = updates.location;
      if (updates.totalAreaSqFt !== undefined) dbPayload.max_cubic_capacity = updates.totalAreaSqFt;
      if (updates.status !== undefined) dbPayload.status = updates.status;

      const { error: updateError } = await supabase
        .from('warehouses')
        .update(dbPayload)
        .eq('id', warehouseToUpdate.uuid);

      if (updateError) throw new Error(updateError.message);
    } catch (err: any) {
      setWarehouses(previousWarehouses);
      throw err;
    }
  };

  const deleteWarehouse = async (id: string) => {
    const warehouseToDelete = warehouses.find(w => w.id === id);
    if (!warehouseToDelete || !warehouseToDelete.uuid) throw new Error("Warehouse not found or missing UUID");

    const previousWarehouses = [...warehouses];
    setWarehouses(prev => prev.filter(w => w.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', warehouseToDelete.uuid);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setWarehouses(previousWarehouses);
      throw err;
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  return {
    warehouses,
    loading,
    error,
    refreshWarehouses: fetchWarehouses,
    setWarehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  };
}
