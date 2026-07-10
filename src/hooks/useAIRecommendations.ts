import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AIRecommendation } from '../data/dashboardData';

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [metrics, setMetrics] = useState({ savings: 0, riskScore: 100, stockoutsAvoided: 0 });
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
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



      let totalSavings = 0;
      let stockouts = 0;
      let riskPenalties = 0;

      const mappedData: AIRecommendation[] = (data || []).map((row) => {
        let savingsStr = "N/A";
        const numericSavings = Number(row.estimated_savings) || 0;
        if (row.estimated_savings !== null) {
          savingsStr = `$${numericSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
          totalSavings += numericSavings;
        }

        if (row.severity === 'high') {
          if (row.alert_message.includes('Low Stock') || row.alert_message.includes('stockout')) {
             stockouts++;
          }
          riskPenalties += 2;
        } else if (row.severity === 'medium') {
          riskPenalties += 1;
        }

        let priceRed = "Optimization strategy active";
        if (row.alert_message.includes('Overstock')) {
           priceRed = "Liquidate excess inventory";
        } else if (row.alert_message.includes('Low Stock')) {
           priceRed = "Prevent imminent stockout";
        } else if (row.alert_message.includes('Warehouse')) {
           priceRed = "Relieve capacity constraint";
        } else if (row.alert_message.includes('Vendor')) {
           priceRed = "Evaluate alternative sourcing";
        } else if (row.alert_message.includes('PO')) {
           priceRed = "Expedite late delivery";
        } else if (row.alert_message.includes('Spend')) {
           priceRed = "Renegotiate payment terms";
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

      setMetrics({
        savings: totalSavings,
        riskScore: Math.max(0, 100 - riskPenalties),
        stockoutsAvoided: stockouts
      });

      if (data && data.length > 0 && data[0].created_at) {
         setLastGenerated(data[0].created_at);
      } else {
         setLastGenerated(null);
      }

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
      if (typeof id === 'string' && id.startsWith('mock-')) {
        setRecommendations(prev => prev.filter(r => r.id !== id));
        return;
      }
      // ── DIAGNOSTIC LOG 1: what id are we sending? ──────────────────────




      const { data, error: updateError, count, status, statusText } = await supabase
        .from('ai_recommendations')
        .update({ status: 'Executed' })
        .eq('id', id)
        .select('id, status')       // ask Supabase to echo back the updated row
        .limit(5);                  // safety cap

      // ── DIAGNOSTIC LOG 2: full response ────────────────────────────────






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



      // Refresh after confirmed update
      await fetchRecommendations();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to apply recommendation');
    }
  };

  const refreshRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: invokeError } = await supabase.functions.invoke('generate-insights');
      if (invokeError) {
        console.error("Error generating insights:", invokeError);
      }
      
      await fetchRecommendations();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, metrics, lastGenerated, loading, error, refreshRecommendations, executeRecommendation };
}
