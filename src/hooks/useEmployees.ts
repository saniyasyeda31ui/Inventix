/**
 * src/hooks/useEmployees.ts
 *
 * Custom hook to manage fetching and state of the Employees/Operators.
 * Replaces mock datasets with live Supabase queries from public.employees.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { EmployeeItem } from '../data/dashboardData';

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // We explicitly map the self-referencing manager_id for good measure,
      // even though the UI doesn't explicitly display the manager right now.
      const { data, error: fetchError } = await supabase
        .from('employees')
        .select(`
          id,
          full_name,
          work_email,
          department,
          title,
          status,
          user_id,
          manager_id,
          profiles ( full_name ),
          manager:employees!manager_id ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mappedEmployees: EmployeeItem[] = (data || []).map((row: any) => {
        return {
          id: `EMP-${row.id.split('-')[0].toUpperCase()}`, // Create a sleek short reference ID
          name: row.full_name,
          email: row.work_email,
          role: row.title,
          department: row.department,
          status: row.status,
        };
      });

      setEmployees(mappedEmployees);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
      console.error('[useEmployees] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refreshEmployees: fetchEmployees,
    setEmployees // For optimistic UI updates
  };
}
