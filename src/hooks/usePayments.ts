/**
 * src/hooks/usePayments.ts
 *
 * Custom hook to manage fetching and state of the Payments/Transactions.
 * Replaces mock datasets with live Supabase queries from public.payments.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PaymentItem } from '../data/dashboardData';

export function usePayments() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // We need to join through purchase_orders to get to the vendors table for the vendorName.
      // Because there is only one FK from payments -> purchase_orders -> vendors, 
      // we don't strictly need to disambiguate, but we can do so for clarity if needed.
      const { data, error: fetchError } = await supabase
        .from('payments')
        .select(`
          id,
          invoice_number,
          amount_paid,
          payment_method,
          status,
          due_date,
          purchase_orders (
            vendors (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedPayments: PaymentItem[] = (data || []).map((row: any) => {
        // Format the currency to match the mock data string format (e.g., "$12,500")
        const amount = Number(row.amount_paid);
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);

        // Date formatting: YYYY-MM-DD
        const dueDate = row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : 'TBD';

        // Navigate the nested join object carefully
        const vendorName = row.purchase_orders?.vendors?.name || 'Unknown Vendor';

        return {
          id: `TRX-${row.id.split('-')[0].toUpperCase()}`, // Create a short transaction reference from UUID
          invoiceId: row.invoice_number,
          vendorName: vendorName,
          amount: formattedAmount,
          dueDate: dueDate,
          status: row.status,
          method: row.payment_method,
        };
      });

      setPayments(mappedPayments);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
      console.error('[usePayments] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    refreshPayments: fetchPayments,
    setPayments // For optimistic UI updates
  };
}
