/**
 * src/hooks/useVendors.ts
 *
 * Custom hook to manage fetching and state of the Vendors directory.
 * Replaces mock datasets with live Supabase queries from public.vendors.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { VendorItem } from '../data/dashboardData';

export function useVendors() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .order('name'); // Sort alphabetically by default

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Map the database snake_case columns to the frontend camelCase interface
      const mappedVendors: VendorItem[] = (data || []).map((row: any) => ({
        id: row.code, // DB has UUID id and text code ('VEN-001'). Frontend uses 'VEN-001' format.
        uuid: row.id, // Store the real DB UUID for updates/deletes
        name: row.name,
        category: row.category,
        score: Number(row.quality_rating_pct),
        onTime: `${Number(row.on_time_delivery_pct)}%`, // Format as string with % for frontend
        contact: row.contact_name || 'N/A',
        email: row.contact_email,
        status: row.status,
      }));

      setVendors(mappedVendors);
    } catch (err: any) {
      setError(err.message || 'Failed to load vendors');
      console.error('[useVendors] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVendor = async (vendorData: any) => {
    // Generate a temporary code for UI optimism if not provided
    const tempId = `VEN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const onTimeNumeric = parseFloat(vendorData.onTime.replace('%', ''));
    
    const dbPayload = {
      code: vendorData.id || tempId,
      name: vendorData.name,
      category: vendorData.category,
      quality_rating_pct: vendorData.score,
      on_time_delivery_pct: isNaN(onTimeNumeric) ? 100 : onTimeNumeric,
      contact_name: vendorData.contact,
      contact_email: vendorData.email,
      status: vendorData.status || 'Under Review'
    };

    const optimisticVendor: VendorItem = {
      id: dbPayload.code,
      name: dbPayload.name,
      category: dbPayload.category,
      score: dbPayload.quality_rating_pct,
      onTime: `${dbPayload.on_time_delivery_pct}%`,
      contact: dbPayload.contact_name,
      email: dbPayload.contact_email,
      status: dbPayload.status as VendorItem['status']
    };

    setVendors(prev => [...prev, optimisticVendor]);

    try {
      const { data, error: insertError } = await supabase
        .from('vendors')
        .insert([dbPayload])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      
      // Update with real uuid
      setVendors(prev => prev.map(v => v.id === optimisticVendor.id ? { ...v, uuid: data.id, id: data.code } : v));
    } catch (err: any) {
      setVendors(prev => prev.filter(v => v.id !== optimisticVendor.id));
      throw err;
    }
  };

  const updateVendor = async (id: string, updates: any) => {
    const vendorToUpdate = vendors.find(v => v.id === id);
    if (!vendorToUpdate || !vendorToUpdate.uuid) throw new Error("Vendor not found or missing UUID");

    const previousVendors = [...vendors];
    const optimisticUpdated = { ...vendorToUpdate, ...updates };
    setVendors(prev => prev.map(v => v.id === id ? optimisticUpdated : v));

    try {
      const dbPayload: any = {};
      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.category !== undefined) dbPayload.category = updates.category;
      if (updates.score !== undefined) dbPayload.quality_rating_pct = updates.score;
      if (updates.onTime !== undefined) {
        const parsed = parseFloat(updates.onTime.replace('%', ''));
        dbPayload.on_time_delivery_pct = isNaN(parsed) ? 100 : parsed;
      }
      if (updates.contact !== undefined) dbPayload.contact_name = updates.contact;
      if (updates.email !== undefined) dbPayload.contact_email = updates.email;
      if (updates.status !== undefined) dbPayload.status = updates.status;

      const { error: updateError } = await supabase
        .from('vendors')
        .update(dbPayload)
        .eq('id', vendorToUpdate.uuid);

      if (updateError) throw new Error(updateError.message);
    } catch (err: any) {
      setVendors(previousVendors);
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    const vendorToDelete = vendors.find(v => v.id === id);
    if (!vendorToDelete || !vendorToDelete.uuid) throw new Error("Vendor not found or missing UUID");

    const previousVendors = [...vendors];
    setVendors(prev => prev.filter(v => v.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorToDelete.uuid);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setVendors(previousVendors);
      throw err;
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    refreshVendors: fetchVendors,
    setVendors, // Provided for optimistic UI updates in the component
    addVendor,
    updateVendor,
    deleteVendor
  };
}
