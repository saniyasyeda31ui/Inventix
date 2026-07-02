/**
 * src/hooks/useReports.ts
 *
 * Custom hook to manage fetching and state of the Reports Module.
 * Replaces mock datasets with live Supabase queries from public.saved_reports.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Definition matching the UI expectations
export interface ReportLog {
  id: string;
  title: string;
  format: "XLSX" | "PDF" | "CSV" | string;
  generatedBy: string;
  dateCreated: string;
  fileSize: string;
  category: string;
}

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch saved_reports and join with profiles to get the generatedBy name.
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
        // Fallbacks for data that might be encoded in query_config JSON or missing
        const config = row.query_config || {};
        const category = config.category || 'General';
        const fileSize = config.fileSize || '1.2 MB'; // Mocking file size if not tracked in DB directly
        const generatedBy = row.author?.full_name || 'System Generated';
        
        // Format date to match mock UI: "2026-06-29 09:12"
        const dateObj = new Date(row.created_at);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

        return {
          id: `REP-${row.id.split('-')[0].toUpperCase()}`, // Clean short reference from UUID
          title: row.title,
          format: row.format,
          generatedBy: generatedBy,
          dateCreated: `${dateStr} ${timeStr}`,
          fileSize: fileSize,
          category: category,
        };
      });

      setReports(mappedReports);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
      console.error('[useReports] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = async (category: string) => {
    if (!user) {
      throw new Error("Must be logged in to compile reports.");
    }
    
    // Defaulting size and format for the simulation, but writing to actual DB
    const newReport = {
      title: `Dynamic ${category} Analytics Ledger`,
      format: 'PDF',
      generated_by: user.id,
      query_config: { category, fileSize: '1.2 MB' },
    };

    const { error: insertError } = await supabase
      .from('saved_reports')
      .insert([newReport]);

    if (insertError) {
      throw new Error(insertError.message);
    }
    
    // Refresh the list directly from Supabase to show the newly generated report
    await fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refreshReports: fetchReports,
    generateReport,
    setReports // For optimistic UI updates when generating a new report
  };
}
