import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AppRole } from '../lib/rbac';
import { FunctionsHttpError, FunctionsFetchError } from '@supabase/supabase-js';

export interface AdminUser {
  id: string; // auth user id
  employee_uuid: string; // employees id
  name: string;
  email: string;
  department: string;
  title: string;
  appRole: AppRole | string;
  status: string;
  created_at: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('employees')
        .select(`
          id,
          user_id,
          full_name,
          work_email,
          department,
          title,
          status,
          created_at,
          profiles ( role )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      const mapped: AdminUser[] = (data || []).map((row: any) => ({
        id: row.user_id || `temp-${row.id}`,
        employee_uuid: row.id,
        name: row.full_name,
        email: row.work_email,
        department: row.department,
        title: row.title,
        appRole: row.profiles?.role || 'viewer',
        status: row.status,
        created_at: row.created_at
      }));

      setUsers(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const provisionUser = async (payload: any) => {
    console.log('Invoking Edge Function: provision-user (POST)');
    console.log('Payload:', payload);

    try {
      const { data, error } = await supabase.functions.invoke('provision-user', {
        method: 'POST',
        body: payload,
      });

      console.log('Edge Function Response (provision-user POST):', { data, error });

      if (error) {
        throw error;
      }

      await fetchUsers();
    } catch (err: any) {
      console.error('Edge Function Exception (provision-user POST):', err);
      if (err instanceof FunctionsHttpError) {
        let errorMsg = "Unknown Edge Error";
        try {
          const body = await err.context.json();
          console.log("FULL EDGE ERROR PARSED:", JSON.stringify(body, null, 2));
          if (typeof body.error === 'string') errorMsg = body.error;
          else if (body.error?.message) errorMsg = body.error.message;
          else if (body.step) errorMsg = `Backend failed at step: ${body.step}`;
          else errorMsg = JSON.stringify(body);
        } catch (parseErr) {
          console.error("Failed to parse edge function JSON:", parseErr);
          errorMsg = "Invalid JSON returned from Edge Function";
        }
        throw new Error(errorMsg);
      } else if (err instanceof FunctionsFetchError) {
        console.error('FunctionsFetchError (POST): Network or CORS issue', err);
        throw new Error('Network error: Failed to reach the Edge Function. This could be a CORS issue or the function might be down.');
      }
      throw new Error(err.message || 'Failed to communicate with the Edge Function');
    }
  };

  const updateRole = async (employee_uuid: string, userId: string, newRole: AppRole) => {
    if (!userId || userId.startsWith('temp-')) throw new Error("User ID is missing. Cannot update role.");
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
    if (error) throw new Error(error.message);
    
    setUsers(prev => prev.map(u => u.employee_uuid === employee_uuid ? { ...u, appRole: newRole } : u));
  };

  const toggleStatus = async (employee_uuid: string, newStatus: string) => {
    const { error } = await supabase
      .from('employees')
      .update({ status: newStatus })
      .eq('id', employee_uuid);
      
    if (error) throw new Error(error.message);
    
    setUsers(prev => prev.map(u => u.employee_uuid === employee_uuid ? { ...u, status: newStatus } : u));
  };

  const deleteUser = async (employee_uuid: string, userId: string) => {
    if (!userId || userId.startsWith('temp-')) {
      const { error } = await supabase.from('employees').delete().eq('id', employee_uuid);
      if (error) throw new Error(error.message);
      setUsers(prev => prev.filter(u => u.employee_uuid !== employee_uuid));
    } else {
      console.log('Invoking Edge Function: provision-user (POST action: deleteUser)');
      console.log('Payload:', { action: 'deleteUser', userId });

      try {
        const { data, error } = await supabase.functions.invoke('provision-user', {
          method: 'POST',
          body: { action: 'deleteUser', userId },
        });

        console.log('Edge Function Response (provision-user POST deleteUser):', { data, error });

        if (error) {
          throw error;
        }
        
        setUsers(prev => prev.filter(u => u.employee_uuid !== employee_uuid));
      } catch (err: any) {
        console.error('Edge Function Exception (provision-user DELETE):', err);
        if (err instanceof FunctionsHttpError) {
          let errorMsg = "Unknown Edge Error";
          try {
            const body = await err.context.json();
            console.log("FULL EDGE ERROR PARSED:", JSON.stringify(body, null, 2));
            if (typeof body.error === 'string') errorMsg = body.error;
            else if (body.error?.message) errorMsg = body.error.message;
            else if (body.step) errorMsg = `Backend failed at step: ${body.step}`;
            else errorMsg = JSON.stringify(body);
          } catch (parseErr) {
            console.error("Failed to parse edge function JSON:", parseErr);
            errorMsg = "Invalid JSON returned from Edge Function";
          }
          throw new Error(errorMsg);
        } else if (err instanceof FunctionsFetchError) {
          console.error('FunctionsFetchError (DELETE): Network or CORS issue', err);
          throw new Error('Network error: Failed to reach the Edge Function. This could be a CORS issue or the function might be down.');
        }
        throw new Error(err.message || 'Failed to communicate with the Edge Function');
      }
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refreshUsers: fetchUsers, provisionUser, updateRole, toggleStatus, deleteUser, resetPassword };
}
