import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

// Ensure env vars are loaded before creating client
setTimeout(async () => {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  console.log("Fetching Inventory...");
  const res = await supabase.from('inventory_balances').select('on_hand_qty, safety_stock_qty, products(name, sku, category), warehouses(name, location)');
  console.log('Error:', res.error);
  console.log('Data count:', res.data?.length);
  if (res.data?.length > 0) {
    console.log('First row:', res.data[0]);
  }
}, 100);
