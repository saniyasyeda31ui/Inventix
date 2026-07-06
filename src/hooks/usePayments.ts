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
        const amount = Number(row.amount_paid);
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);

        const dueDate = row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : 'TBD';
        const vendorName = row.purchase_orders?.vendors?.name || 'Unknown Vendor';

        return {
          id: `TRX-${row.id.split('-')[0].toUpperCase()}`,
          uuid: row.id,
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

  const addPayment = async (paymentData: any) => {
    const tempUuid = crypto.randomUUID();
    const tempTrx = `TRX-${tempUuid.split('-')[0].toUpperCase()}`;
    
    const dbPayload = {
      purchase_order_id: paymentData.purchase_order_id || null,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount_paid: paymentData.amount_paid || 0,
      payment_method: paymentData.method || 'Bank Transfer',
      status: paymentData.status || 'Processing',
      due_date: paymentData.dueDate || null,
    };

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(dbPayload.amount_paid);

    const optimisticPayment: PaymentItem = {
      id: tempTrx,
      uuid: tempUuid,
      invoiceId: dbPayload.invoice_number,
      vendorName: 'Loading...',
      amount: formattedAmount,
      dueDate: dbPayload.due_date || 'TBD',
      status: dbPayload.status as any,
      method: dbPayload.payment_method
    };

    setPayments(prev => [optimisticPayment, ...prev]);

    try {
      const { data, error: insertError } = await supabase
        .from('payments')
        .insert([dbPayload])
        .select('id')
        .single();

      if (insertError) throw new Error(insertError.message);
      
      fetchPayments();
    } catch (err: any) {
      setPayments(prev => prev.filter(p => p.id !== tempTrx));
      throw err;
    }
  };

  const updatePayment = async (id: string, updates: any) => {
    const paymentToUpdate = payments.find(p => p.id === id || p.uuid === id); // Try both in case component passes uuid
    if (!paymentToUpdate || !paymentToUpdate.uuid) throw new Error("Payment not found or missing UUID");

    const previousPayments = [...payments];
    const optimisticUpdated = { ...paymentToUpdate, ...updates };
    setPayments(prev => prev.map(p => p.uuid === paymentToUpdate.uuid ? optimisticUpdated : p));

    try {
      const dbPayload: any = {};
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.method !== undefined) dbPayload.payment_method = updates.method;
      if (updates.amount_paid !== undefined) dbPayload.amount_paid = updates.amount_paid;
      if (updates.dueDate !== undefined) dbPayload.due_date = updates.dueDate;

      const { error: updateError } = await supabase
        .from('payments')
        .update(dbPayload)
        .eq('id', paymentToUpdate.uuid);

      if (updateError) throw new Error(updateError.message);
      
      // If amount or other critical fields change, refresh to reformat
      if (updates.amount_paid !== undefined) fetchPayments();
    } catch (err: any) {
      setPayments(previousPayments);
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    const paymentToDelete = payments.find(p => p.id === id || p.uuid === id);
    if (!paymentToDelete || !paymentToDelete.uuid) throw new Error("Payment not found or missing UUID");

    const previousPayments = [...payments];
    setPayments(prev => prev.filter(p => p.uuid !== paymentToDelete.uuid));

    try {
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentToDelete.uuid);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setPayments(previousPayments);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    refreshPayments: fetchPayments,
    setPayments,
    addPayment,
    updatePayment,
    deletePayment
  };
}
