-- Migration: Automate inventory receipts for Purchase Orders
-- This trigger automatically adds inventory to the correct warehouse, logs the activity,
-- and resolves AI alerts for the received items.

-- Safely ensure a UNIQUE constraint/index exists for the UPSERT logic
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_balances_product_warehouse 
ON public.inventory_balances(product_id, warehouse_id);

CREATE OR REPLACE FUNCTION public.handle_po_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product_id uuid;
  v_product_name text;
  v_quantity integer;
  v_product_category text;
  v_target_warehouse_id uuid;
BEGIN
  -- We check for 'Completed' or 'Received' since frontend uses 'Completed' for receiving
  IF NEW.status IN ('Received', 'Completed') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    
    -- Ensure PO is linked to a PR to determine product and quantity
    IF NEW.purchase_request_id IS NULL THEN
      RAISE EXCEPTION 'PO Receipt Failed: purchase_request_id is NULL for PO %', NEW.po_number;
    END IF;

    -- Get the purchase request linked to this PO
    SELECT product_id, quantity INTO v_product_id, v_quantity
    FROM public.purchase_requests
    WHERE id = NEW.purchase_request_id;

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'PO Receipt Failed: product_id could not be found for PO %', NEW.po_number;
    END IF;

    IF v_quantity IS NULL THEN
      RAISE EXCEPTION 'PO Receipt Failed: quantity could not be found for PO %', NEW.po_number;
    END IF;

    -- Get the product category and name
    SELECT category, product_name INTO v_product_category, v_product_name
    FROM public.products
    WHERE id = v_product_id;

    -- 1. Check if the product already has an inventory balance
    SELECT warehouse_id INTO v_target_warehouse_id
    FROM public.inventory_balances
    WHERE product_id = v_product_id
    ORDER BY on_hand_qty DESC
    LIMIT 1;

    -- 2. If no balance exists, determine warehouse by category
    IF v_target_warehouse_id IS NULL THEN
      IF v_product_category ILIKE '%Materials%' OR v_product_category ILIKE '%Hardware%' OR v_product_category ILIKE '%Adhesives%' THEN
        SELECT id INTO v_target_warehouse_id FROM public.warehouses WHERE name ILIKE '%Raw Material%' LIMIT 1;
      ELSIF v_product_category ILIKE '%Furniture%' THEN
        SELECT id INTO v_target_warehouse_id FROM public.warehouses WHERE name ILIKE '%Finished Goods%' LIMIT 1;
      END IF;
      
      -- Fallback to the warehouse with the most available capacity
      IF v_target_warehouse_id IS NULL THEN
        SELECT id INTO v_target_warehouse_id FROM public.warehouses ORDER BY current_occupancy_pct ASC LIMIT 1;
      END IF;
    END IF;

    IF v_target_warehouse_id IS NULL THEN
      RAISE EXCEPTION 'PO Receipt Failed: warehouse_id could not be determined for product %', v_product_id;
    END IF;

    -- 3. Update or Insert the inventory balance
    -- This UPSERT logic correctly handles existing and new records.
    INSERT INTO public.inventory_balances (product_id, warehouse_id, on_hand_qty, allocated_qty, safety_stock_qty)
    VALUES (v_product_id, v_target_warehouse_id, v_quantity, 0, 50)
    ON CONFLICT (product_id, warehouse_id)
    DO UPDATE SET on_hand_qty = inventory_balances.on_hand_qty + EXCLUDED.on_hand_qty;

    -- 4. Insert activity log for the receipt
    INSERT INTO public.activity_logs (action, details, type, user_id)
    VALUES (
      'Inventory Received',
      'Automatically received ' || v_quantity || ' units of ' || v_product_name || ' into warehouse from ' || NEW.po_number,
      'success',
      COALESCE(auth.uid(), NEW.created_by)
    );

    -- 5. Refresh AI Insights by dismissing active stock alerts for this newly stocked item
    UPDATE public.ai_recommendations 
    SET status = 'Executed' 
    WHERE item = v_product_name AND status = 'Active';

  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_po_received ON public.purchase_orders;
CREATE TRIGGER trg_po_received
  AFTER UPDATE OF status ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_po_received();
