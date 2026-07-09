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
        .select('*, vendors(name)')
        .order('product_name'); // Sort alphabetically by default

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Map the database snake_case columns to the frontend camelCase interface
      const mappedProducts: ProductItem[] = (data || []).map((row: any) => ({
        id: row.id,
        sku: row.sku,
        name: row.product_name,
        category: row.category,
        unitPrice: Number(row.unit_price), // DB numeric comes back as string sometimes
        leadTimeDays: row.lead_time_days,
        primaryVendor: row.vendors?.name || row.vendor_id || 'Unknown Vendor',
        stockStatus: 'In Stock', // Field removed from DB, defaulting to In Stock
      }));

      setProducts(mappedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('[useProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: Omit<ProductItem, 'id'>) => {
    const newId = `PRD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newProduct = { ...productData, id: newId } as ProductItem;
    
    const previousProducts = [...products];
    setProducts((prev) => [...prev, newProduct]);

    const dbPayload = {
      id: newId,
      sku: productData.sku,
      product_name: productData.name,
      category: productData.category,
      unit_price: productData.unitPrice,
      lead_time_days: productData.leadTimeDays,
      vendor_id: productData.primaryVendor,
    };

    console.log('[useProducts] CREATE Payload:', dbPayload);

    const { data, error, status } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single();

    console.log('[useProducts] CREATE Supabase response:', { data, error, status, insertedRow: data });

    if (error) {
      setProducts(previousProducts);
      console.error('[useProducts] CREATE Error:', error);
      fetchProducts();
      throw new Error(error.message);
    }
    
    setProducts((prev) => prev.map(p => p.id === newId ? {
      ...p,
      id: data.id,
      sku: data.sku,
      name: data.product_name,
      category: data.category,
      unitPrice: Number(data.unit_price),
      leadTimeDays: data.lead_time_days,
      primaryVendor: data.vendor_id,
      stockStatus: 'In Stock',
    } : p));

    return data;
  };

  const updateProduct = async (id: string, updates: Partial<ProductItem>) => {
    const previousProducts = [...products];
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    const dbPayload: any = {};
    if (updates.sku !== undefined) dbPayload.sku = updates.sku;
    if (updates.name !== undefined) dbPayload.product_name = updates.name;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.unitPrice !== undefined) dbPayload.unit_price = updates.unitPrice;
    if (updates.leadTimeDays !== undefined) dbPayload.lead_time_days = updates.leadTimeDays;
    if (updates.primaryVendor !== undefined) dbPayload.vendor_id = updates.primaryVendor;

    console.log('[useProducts] UPDATE Payload:', dbPayload);

    const { data, error, status } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    console.log('[useProducts] UPDATE Supabase response:', { data, error, status });

    if (error) {
      setProducts(previousProducts);
      console.error('[useProducts] UPDATE Error:', error);
      fetchProducts();
      throw new Error(error.message);
    }

    return data;
  };

  const deleteProduct = async (id: string) => {
    const previousProducts = [...products];
    setProducts((prev) => prev.filter(p => p.id !== id));

    console.log('[useProducts] DELETE Identifier:', id);

    const { error, status, count } = await supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    console.log('[useProducts] DELETE Supabase response:', { status, error, affectedRows: count });

    if (error) {
      setProducts(previousProducts);
      console.error('[useProducts] DELETE Error:', error);
      fetchProducts();
      throw new Error(error.message);
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
