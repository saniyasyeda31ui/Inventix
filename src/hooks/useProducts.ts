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
        .select(`
          *,
          vendors(name),
          inventory_balances(on_hand_qty)
        `)
        .order('product_name');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedProducts: ProductItem[] = (data || []).map((row: any) => {
        const currentStock = Array.isArray(row.inventory_balances)
          ? row.inventory_balances.reduce((sum: number, ib: any) => sum + (ib.on_hand_qty || 0), 0)
          : 0;

        return {
          id: row.id,
          product_id: row.product_id,
          product_name: row.product_name,
          category: row.category,
          description: row.description,
          unit: row.unit,
          unitPrice: Number(row.unit_price),
          currentStock,
          reorderLevel: row.reorder_level,
          safetyStock: row.safety_stock,
          vendorId: row.vendor_id,
          primaryVendor: row.vendors?.name || 'Unknown Vendor',
          leadTimeDays: row.lead_time_days,
          notes: row.notes,
          sku: row.sku,
        };
      });

      setProducts(mappedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('[useProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (
    productData: Omit<ProductItem, 'id' | 'product_id' | 'primaryVendor' | 'currentStock'>,
    initialStock: number = 0,
    warehouseId?: string
  ) => {
    const dbPayload = {
      product_name: productData.product_name,
      category: productData.category,
      description: productData.description,
      unit: productData.unit,
      unit_price: productData.unitPrice,
      reorder_level: productData.reorderLevel,
      safety_stock: productData.safetyStock,
      vendor_id: productData.vendorId,
      lead_time_days: productData.leadTimeDays,
      notes: productData.notes,
      sku: productData.sku,
    };

    console.log('[useProducts] CREATE Payload:', dbPayload);

    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select('*, vendors(name)')
      .single();

    if (error) {
      console.error('[useProducts] CREATE Error:', error);
      throw new Error(error.message);
    }

    if (initialStock > 0 && warehouseId) {
      const { error: invError } = await supabase
        .from('inventory_balances')
        .insert([{
          product_id: data.id,
          warehouse_id: warehouseId,
          on_hand_qty: initialStock,
          allocated_qty: 0,
          safety_stock_qty: data.safety_stock
        }]);
      if (invError) console.error('[useProducts] INVENTORY Error:', invError);
    }

    // Refresh to get the complete up-to-date data with stock
    await fetchProducts();
    return data;
  };

  const updateProduct = async (id: string, updates: Partial<ProductItem>) => {
    const dbPayload: any = {};
    if (updates.sku !== undefined) dbPayload.sku = updates.sku;
    if (updates.name !== undefined) dbPayload.product_name = updates.name;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.unit !== undefined) dbPayload.unit = updates.unit;
    if (updates.unitPrice !== undefined) dbPayload.unit_price = updates.unitPrice;
    if (updates.reorderLevel !== undefined) dbPayload.reorder_level = updates.reorderLevel;
    if (updates.safetyStock !== undefined) dbPayload.safety_stock = updates.safetyStock;
    if (updates.vendorId !== undefined) dbPayload.vendor_id = updates.vendorId;
    if (updates.leadTimeDays !== undefined) dbPayload.lead_time_days = updates.leadTimeDays;
    if (updates.notes !== undefined) dbPayload.notes = updates.notes;

    console.log('[useProducts] UPDATE Payload:', dbPayload);

    const { data, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[useProducts] UPDATE Error:', error);
      throw new Error(error.message);
    }

    await fetchProducts();
    return data;
  };

  const deleteProduct = async (id: string) => {
    console.log('[useProducts] DELETE Identifier:', id);

    const { error } = await supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error('[useProducts] DELETE Error:', error);
      throw new Error(error.message);
    }
    
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

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
