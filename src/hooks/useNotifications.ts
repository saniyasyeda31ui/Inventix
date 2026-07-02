/**
 * src/hooks/useNotifications.ts
 *
 * Custom hook for the public.notifications Supabase table.
 *
 * Actual schema (confirmed):
 *  id          uuid / text   primary key
 *  title       text          notification heading
 *  description text          body copy
 *  read        boolean       false = unread
 *  time_label  text          pre-formatted relative time string (e.g. "5m ago")
 *  user_id     uuid?         optional user scoping
 *  created_at  timestamptz   ordering
 *
 * Exposes:
 *  - notifications        — ordered by created_at DESC
 *  - loading              — true during initial fetch / refresh
 *  - error                — string on failure, null otherwise
 *  - unreadCount          — derived: notifications where read === false
 *  - refreshNotifications() — full re-fetch from Supabase
 *  - markAsRead(id)       — optimistic update; rolls back on Supabase error
 *  - markAllAsRead()      — optimistic batch; re-fetches on Supabase error
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ── Type ─────────────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  time_label: string;
  user_id?: string | null;
  created_at: string;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('id, title, description, read, time_label, user_id, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      setNotifications((data as AppNotification[]) ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load notifications');
      console.error('[useNotifications] fetchNotifications error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Mark single notification as read ──────────────────────────────────────

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update — badge decrements instantly
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (updateError) {
        // Rollback on failure
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: false } : n))
        );
        console.error('[useNotifications] markAsRead error:', updateError.message);
      }
    } catch (err: any) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: false } : n))
      );
      console.error('[useNotifications] markAsRead error:', err);
    }
  }, []);

  // ── Mark all notifications as read ────────────────────────────────────────

  const markAllAsRead = useCallback(async () => {
    // Optimistic batch update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (updateError) {
        // Rollback — re-fetch authoritative state
        console.error('[useNotifications] markAllAsRead error:', updateError.message);
        await fetchNotifications();
      }
    } catch (err: any) {
      console.error('[useNotifications] markAllAsRead error:', err);
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  // ── Mount fetch ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Derived state ─────────────────────────────────────────────────────────

  const unreadCount = notifications.filter(n => n.read === false).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refreshNotifications: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
