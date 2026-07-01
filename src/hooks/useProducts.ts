/**
 * src/hooks/useProducts.ts
 *
 * Custom hook to manage fetching and state of the Products catalogue.
 * Replaces mock datasets with live Supabase queries from public.products.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProductItem } from '../data/dashboardData';

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('name'); // Sort alphabetically by default

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Map the database snake_case columns to the frontend camelCase interface
      const mappedProducts: ProductItem[] = (data || []).map((row: any) => ({
        id: row.id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        unitPrice: Number(row.unit_price), // DB numeric comes back as string sometimes
        leadTimeDays: row.lead_time_days,
        primaryVendor: row.primary_vendor,
        stockStatus: row.stock_status,
      }));

      setProducts(mappedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('[useProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch immediately on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    // Provide a setter in case optimistic UI updates are needed locally
    setProducts 
  };
}
