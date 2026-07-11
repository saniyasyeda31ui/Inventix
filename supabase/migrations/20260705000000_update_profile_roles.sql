-- 1. Drop existing check constraints dynamically
DO $$
DECLARE
    con record;
BEGIN
    FOR con IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.profiles'::regclass 
        AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || quote_ident(con.conname);
    END LOOP;
END $$;

-- 2. Update existing data to match new enterprise roles
UPDATE public.profiles SET role = 'admin' WHERE role = 'manager';
UPDATE public.profiles SET role = 'procurement_manager' WHERE role = 'sourcing_admin';

-- 3. Add the new constraint
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role in ('admin', 'procurement_manager', 'inventory_manager', 'warehouse_manager', 'finance_manager', 'viewer'));
  
-- 4. Update the handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, organization)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name',     'ERP Specialist'),
    coalesce(new.raw_user_meta_data ->> 'role',          'viewer'),
    coalesce(new.raw_user_meta_data ->> 'organization',  'Acme Sourcing Hub')
  );
  RETURN new;
END;
$$;

-- 5. Update RLS Helper Functions

-- is_manager() previously meant admin, we keep it that way for RLS
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_sourcing_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'procurement_manager'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'procurement_manager', 'inventory_manager', 'warehouse_manager', 'finance_manager')
  );
$$;
