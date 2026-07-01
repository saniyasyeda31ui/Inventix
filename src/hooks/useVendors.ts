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

  // Fetch immediately on mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    refreshVendors: fetchVendors,
    setVendors // Provided for optimistic UI updates in the component
  };
}
