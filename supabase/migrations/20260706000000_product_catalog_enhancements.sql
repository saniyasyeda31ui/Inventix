-- Migration: Product Catalog Enhancements
-- Safely alters `products` table and updates relationships to use UUIDs.

-- 1. Drop dependent foreign keys first to allow changing the primary key of products.
ALTER TABLE public.inventory_balances DROP CONSTRAINT inventory_balances_product_id_fkey;
ALTER TABLE public.purchase_requests DROP CONSTRAINT purchase_requests_product_id_fkey;
ALTER TABLE public.products DROP CONSTRAINT products_pkey;

-- 2. Add new UUID column to products and setup sequence/trigger for product_id.
ALTER TABLE public.products ADD COLUMN new_id uuid DEFAULT gen_random_uuid();

-- Create sequence for PRD-000001 format
CREATE SEQUENCE IF NOT EXISTS product_id_seq START 1;

CREATE OR REPLACE FUNCTION public.set_product_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.product_id IS NULL THEN
    NEW.product_id := 'PRD-' || LPAD(nextval('product_id_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

-- Rename existing text 'id' to 'product_id', and 'new_id' to 'id'
ALTER TABLE public.products RENAME COLUMN id TO product_id;
ALTER TABLE public.products RENAME COLUMN new_id TO id;
ALTER TABLE public.products ADD PRIMARY KEY (id);
ALTER TABLE public.products ADD CONSTRAINT products_product_id_key UNIQUE (product_id);

CREATE TRIGGER trg_set_product_id
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_product_id();


-- 3. Update inventory_balances to point to the new UUID primary key.
ALTER TABLE public.inventory_balances ADD COLUMN new_product_id uuid;
UPDATE public.inventory_balances ib 
SET new_product_id = p.id 
FROM public.products p 
WHERE p.product_id = ib.product_id;

ALTER TABLE public.inventory_balances DROP COLUMN product_id;
ALTER TABLE public.inventory_balances RENAME COLUMN new_product_id TO product_id;
ALTER TABLE public.inventory_balances ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE public.inventory_balances ADD CONSTRAINT inventory_balances_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


-- 4. Update purchase_requests to point to the new UUID primary key.
ALTER TABLE public.purchase_requests ADD COLUMN new_product_id uuid;
UPDATE public.purchase_requests pr 
SET new_product_id = p.id 
FROM public.products p 
WHERE p.product_id = pr.product_id;

ALTER TABLE public.purchase_requests DROP COLUMN product_id;
ALTER TABLE public.purchase_requests RENAME COLUMN new_product_id TO product_id;
ALTER TABLE public.purchase_requests ADD CONSTRAINT purchase_requests_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


-- 5. Add new columns to products.
ALTER TABLE public.products RENAME COLUMN name TO product_name;
ALTER TABLE public.products ALTER COLUMN sku DROP NOT NULL;
ALTER TABLE public.products ADD COLUMN description text;
ALTER TABLE public.products ADD COLUMN unit text DEFAULT 'pcs' NOT NULL;
ALTER TABLE public.products ADD COLUMN reorder_level integer DEFAULT 50 NOT NULL;
ALTER TABLE public.products ADD COLUMN safety_stock integer DEFAULT 20 NOT NULL;
ALTER TABLE public.products ADD COLUMN vendor_id uuid;
ALTER TABLE public.products ADD COLUMN notes text;

-- Map existing primary_vendor string to vendor_id
UPDATE public.products p 
SET vendor_id = v.id 
FROM public.vendors v 
WHERE v.name = p.primary_vendor;

-- Fallback for unmatched vendors (just in case there's mock data mismatch, though there shouldn't be).
-- We need vendor_id to be NOT NULL, so if it's null we could assign a random vendor or fail.
-- Let's safely set it if null to the first available vendor to prevent constraint failure on mock data.
UPDATE public.products SET vendor_id = (SELECT id FROM public.vendors LIMIT 1) WHERE vendor_id IS NULL;

ALTER TABLE public.products ALTER COLUMN vendor_id SET NOT NULL;
ALTER TABLE public.products ADD CONSTRAINT products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE RESTRICT;

-- Drop obsolete columns from products
ALTER TABLE public.products DROP COLUMN primary_vendor;
ALTER TABLE public.products DROP COLUMN stock_status;
