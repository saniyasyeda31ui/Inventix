/**
 * src/hooks/useReports.ts
 *
 * Custom hook to manage fetching and state of the Reports Module.
 * Replaces mock datasets with live Supabase queries from public.saved_reports.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface ReportConfig {
  category: string;
  dateRange: string;
  searchQuery: string;
}

export interface ReportLog {
  id: string;
  title: string;
  format: "XLSX" | "PDF" | "CSV" | string;
  generatedBy: string;
  dateCreated: string;
  fileSize: string;
  category: string;
}

export function useReports(config: ReportConfig) {
  const { user } = useAuth();
  
  const [savedReports, setSavedReports] = useState<ReportLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const [reportData, setReportData] = useState<any[]>([]);
  const [loadingReport, setLoadingReport] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  const { category, dateRange, searchQuery } = config;

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('saved_reports')
        .select(`
          id,
          title,
          format,
          created_at,
          query_config,
          file_url,
          author:profiles!generated_by ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedReports: ReportLog[] = (data || []).map((row: any) => {
        const conf = row.query_config || {};
        const cat = conf.category || 'General';
        const fileSize = conf.fileSize || '1.2 MB';
        const generatedBy = row.author?.full_name || 'System Generated';
        
        const dateObj = new Date(row.created_at);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toTimeString().split(' ')[0].slice(0, 5);

        return {
          id: `REP-${row.id.split('-')[0].toUpperCase()}`,
          title: row.title,
          format: row.format,
          generatedBy: generatedBy,
          dateCreated: `${dateStr} ${timeStr}`,
          fileSize: fileSize,
          category: cat,
        };
      });

      setSavedReports(mappedReports);
    } catch (err: any) {
      setError(err.message || 'Failed to load report history');
      console.error('[useReports] Error:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchLiveReport = useCallback(async () => {
    console.log("[useReports Diagnostics] Category Switch Triggered:", category);
    
    if (!category) {
      console.log("[useReports Diagnostics] No category provided, setting loading false");
      setLoadingReport(false);
      return;
    }
    
    try {
      setLoadingReport(true);
      setError(null);

      let data: any[] = [];
      let fetchError: any = null;

      if (category === 'Inventory') {
        const res = await supabase.from('inventory_balances').select(`
          on_hand_qty, 
          safety_stock_qty, 
          products:product_id (product_name, sku, category), 
          warehouses:warehouse_id (name, location)
        `);
        fetchError = res.error;
        console.log("[useReports Diagnostics] Query Result Data (Raw):", res.data);
        
        data = (res.data || []).map((r: any) => ({
          Product: r.products?.product_name || 'Unknown',
          SKU: r.products?.sku || 'Unknown',
          Category: r.products?.category || 'Unknown',
          Warehouse: r.warehouses?.name || 'Unknown',
          Location: r.warehouses?.location || 'Unknown',
          "On Hand": r.on_hand_qty,
          "Safety Stock": r.safety_stock_qty
        }));
      } else if (category === 'Purchase') {
        const res = await supabase.from('purchase_orders').select(`
          po_number, 
          total_amount, 
          status, 
          created_at, 
          vendors:vendor_id (name), 
          buyer
        `);
        fetchError = res.error;
        data = (res.data || []).map((r: any) => ({
          "PO Number": r.po_number,
          Vendor: r.vendors?.name || 'Unknown',
          Amount: `$${Number(r.total_amount).toFixed(2)}`,
          Status: r.status,
          Date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
          Buyer: r.buyer || 'Unknown'
        }));
      } else if (category === 'Vendor') {
        const res = await supabase.from('vendors').select('code, name, category, quality_rating_pct, on_time_delivery_pct, status');
        fetchError = res.error;
        data = (res.data || []).map((r: any) => ({
          Code: r.code,
          Name: r.name,
          Category: r.category || 'N/A',
          "Quality Score": `${r.quality_rating_pct}%`,
          "On-Time Rate": `${r.on_time_delivery_pct}%`,
          Status: r.status
        }));
      } else if (category === 'Payment') {
        const res = await supabase.from('payments').select('invoice_number, amount_paid, payment_method, status, due_date');
        fetchError = res.error;
        data = (res.data || []).map((r: any) => ({
          "Invoice #": r.invoice_number,
          Amount: `$${Number(r.amount_paid).toFixed(2)}`,
          Method: r.payment_method,
          Status: r.status,
          "Due Date": r.due_date ? new Date(r.due_date).toISOString().split('T')[0] : ''
        }));
      } else if (category === 'Employee') {
        const res = await supabase.from('employees').select('full_name, department, title, status, work_email');
        fetchError = res.error;
        data = (res.data || []).map((r: any) => ({
          Name: r.full_name,
          Email: r.work_email,
          Department: r.department || 'N/A',
          Title: r.title || 'N/A',
          Status: r.status
        }));
      }

      if (fetchError) throw new Error(fetchError.message);

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter(row => 
          Object.values(row).some(val => 
            String(val).toLowerCase().includes(query)
          )
        );
      }

      console.log("[useReports Diagnostics] Category:", category);
      console.log("[useReports Diagnostics] Processed Data:", data);
      console.log("[useReports Diagnostics] Row Count:", data.length);
      
      // Ensure we explicitly assign the mapped and filtered rows
      setReportData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load live report data');
      console.error('[useReports] Live Error:', err);
    } finally {
      console.log("[useReports Diagnostics] Setting loading state to false");
      setLoadingReport(false);
    }
  }, [category, dateRange, searchQuery]);

  const recordExport = async (exportCategory: string, title: string, format: string, size: string) => {
    if (!user) throw new Error("Must be logged in to record export.");
    
    const newReport = {
      title: title,
      format: format,
      generated_by: user.id,
      query_config: { category: exportCategory, fileSize: size },
    };

    const { error: insertError } = await supabase
      .from('saved_reports')
      .insert([newReport]);

    if (insertError) throw new Error(insertError.message);
    
    await fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchLiveReport();
  }, [fetchLiveReport]);

  return {
    savedReports,
    loadingHistory,
    reportData,
    loadingReport,
    error,
    refreshHistory: fetchHistory,
    refreshLiveReport: fetchLiveReport,
    recordExport
  };
}
