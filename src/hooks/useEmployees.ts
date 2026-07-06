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
          id: `EMP-${row.id.split('-')[0].toUpperCase()}`,
          uuid: row.id,
          name: row.full_name,
          email: row.work_email,
          role: row.title,
          department: row.department,
          status: row.status,
          manager_id: row.manager_id
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

  const addEmployee = async (employeeData: any) => {
    const tempUuid = crypto.randomUUID();
    const tempEmp = `EMP-${tempUuid.split('-')[0].toUpperCase()}`;
    
    const dbPayload = {
      full_name: employeeData.name,
      work_email: employeeData.email,
      department: employeeData.department || 'Operations',
      title: employeeData.role || 'Staff',
      status: employeeData.status || 'Active',
      manager_id: employeeData.manager_id || null,
    };

    const optimisticEmployee: EmployeeItem = {
      id: tempEmp,
      uuid: tempUuid,
      name: dbPayload.full_name,
      email: dbPayload.work_email,
      role: dbPayload.title,
      department: dbPayload.department,
      status: dbPayload.status as any,
      manager_id: dbPayload.manager_id
    };

    setEmployees(prev => [optimisticEmployee, ...prev]);

    try {
      const { data, error: insertError } = await supabase
        .from('employees')
        .insert([dbPayload])
        .select('id')
        .single();

      if (insertError) throw new Error(insertError.message);
      
      setEmployees(prev => prev.map(e => e.id === tempEmp ? { ...e, uuid: data.id } : e));
    } catch (err: any) {
      setEmployees(prev => prev.filter(e => e.id !== tempEmp));
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: any) => {
    const employeeToUpdate = employees.find(e => e.id === id || e.uuid === id);
    if (!employeeToUpdate || !employeeToUpdate.uuid) throw new Error("Employee not found or missing UUID");

    const previousEmployees = [...employees];
    const optimisticUpdated = { ...employeeToUpdate, ...updates };
    setEmployees(prev => prev.map(e => e.uuid === employeeToUpdate.uuid ? optimisticUpdated : e));

    try {
      const dbPayload: any = {};
      if (updates.name !== undefined) dbPayload.full_name = updates.name;
      if (updates.email !== undefined) dbPayload.work_email = updates.email;
      if (updates.department !== undefined) dbPayload.department = updates.department;
      if (updates.role !== undefined) dbPayload.title = updates.role;
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.manager_id !== undefined) dbPayload.manager_id = updates.manager_id;

      const { error: updateError } = await supabase
        .from('employees')
        .update(dbPayload)
        .eq('id', employeeToUpdate.uuid);

      if (updateError) throw new Error(updateError.message);
    } catch (err: any) {
      setEmployees(previousEmployees);
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    const employeeToDelete = employees.find(e => e.id === id || e.uuid === id);
    if (!employeeToDelete || !employeeToDelete.uuid) throw new Error("Employee not found or missing UUID");

    const previousEmployees = [...employees];
    setEmployees(prev => prev.filter(e => e.uuid !== employeeToDelete.uuid));

    try {
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeToDelete.uuid);

      if (deleteError) throw new Error(deleteError.message);
    } catch (err: any) {
      setEmployees(previousEmployees);
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refreshEmployees: fetchEmployees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
}
