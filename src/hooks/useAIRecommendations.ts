import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AIRecommendation } from '../data/dashboardData';

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      console.log(`[useAIRecommendations] Supabase returned ${data?.length || 0} rows.`);

      const mappedData: AIRecommendation[] = (data || []).map((row) => {
        // Format estimated savings to match UI (e.g. "₹48,500/mo")
        let savingsStr = "N/A";
        if (row.estimated_savings !== null) {
          savingsStr = `₹${Number(row.estimated_savings).toLocaleString('en-IN')}/mo`;
        }

        // We generate a derived price reduction string based on savings
        let priceRed = "Alternative pricing strategy recommended";
        if (row.estimated_savings && row.estimated_savings > 100000) {
          priceRed = "Lock-in bulk discount before projected price hike";
        } else if (row.estimated_savings && row.estimated_savings > 0) {
          priceRed = "Lower pricing than current supplier";
        }

        return {
          id: row.id,
          item: row.item,
          alert: row.alert_message,
          reorderQty: row.suggested_qty,
          alternativeSupplier: row.alternative_supplier || "Unknown",
          priceReduction: priceRed,
          estimatedSavings: savingsStr,
          severity: row.severity as "high" | "medium" | "low"
        };
      });

      console.log('[useAIRecommendations] Mapped objects:', mappedData);

      setRecommendations(mappedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load AI recommendations');
      console.error('[useAIRecommendations] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeRecommendation = async (id: string | number) => {
    try {
      // ── DIAGNOSTIC LOG 1: what id are we sending? ──────────────────────
      console.log('[executeRecommendation] ▶ Sending UPDATE');
      console.log('  id value :', id);
      console.log('  id typeof:', typeof id);

      const { data, error: updateError, count, status, statusText } = await supabase
        .from('ai_recommendations')
        .update({ status: 'Executed' })
        .eq('id', id)
        .select('id, status')       // ask Supabase to echo back the updated row
        .limit(5);                  // safety cap

      // ── DIAGNOSTIC LOG 2: full response ────────────────────────────────
      console.log('[executeRecommendation] ◀ Supabase response');
      console.log('  HTTP status :', status, statusText);
      console.log('  error       :', updateError ?? null);
      console.log('  data (rows) :', data);
      console.log('  count       :', count);

      // ── DIAGNOSTIC LOG 3: interpret what happened ───────────────────────
      if (updateError) {
        console.error('[executeRecommendation] ✖ Update failed with error:', updateError.message);
        console.error('  Full error object:', updateError);
        throw new Error(updateError.message);
      }

      if (!data || data.length === 0) {
        // HTTP 200 + empty result + no error = classic RLS silent block.
        // The row exists but no UPDATE policy matched the calling role.
        console.warn('[executeRecommendation] ⚠ 0 rows affected — possible causes:');
        console.warn('  1. RLS: no UPDATE policy exists for the authenticated role');
        console.warn('  2. ID mismatch: the id did not match any row');
        console.warn('  3. The row was already Executed before this call');
        throw new Error(
          `Update returned 0 affected rows for id "${id}". ` +
          'This is typically caused by a missing RLS UPDATE policy on ai_recommendations.'
        );
      }

      console.log('[executeRecommendation] ✔ Updated', data.length, 'row(s):', data);

      // Refresh after confirmed update
      await fetchRecommendations();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to apply recommendation');
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations,
    executeRecommendation
  };
}
