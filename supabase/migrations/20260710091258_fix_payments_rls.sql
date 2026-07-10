-- Update RLS policies for payments to allow any admin or manager to manage payments
-- Previously it was restricted to is_manager() which only includes 'admin' after the role updates.

DROP POLICY IF EXISTS "payments: managers can insert" ON public.payments;
CREATE POLICY "payments: managers can insert"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_manager());

DROP POLICY IF EXISTS "payments: managers can update" ON public.payments;
CREATE POLICY "payments: managers can update"
  ON public.payments FOR UPDATE TO authenticated
  USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "payments: managers can delete" ON public.payments;
CREATE POLICY "payments: managers can delete"
  ON public.payments FOR DELETE TO authenticated
  USING (public.is_admin_or_manager());
