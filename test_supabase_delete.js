import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Inserting a dummy warehouse...");
  const dummyCode = `WH-TEST-${Date.now()}`;
  const { data: insertData, error: insertError } = await supabase
    .from('warehouses')
    .insert([{
      code: dummyCode,
      name: "Test Warehouse",
      location: "Test Location",
      max_cubic_capacity: 1000,
      current_occupancy_pct: 0,
      status: "Active"
    }])
    .select();
    
  if (insertError) {
    console.error("Insert Error:", insertError);
    return;
  }
  
  console.log("Inserted warehouse successfully:", insertData[0]);
  
  console.log("Attempting to delete warehouse using code:", dummyCode);
  
  const { data, error, status } = await supabase
    .from('warehouses')
    .delete()
    .eq('code', dummyCode)
    .select(); // .select() ensures data is returned if deleted
    
  console.log("Supabase DELETE response:");
  console.log("status:", status);
  console.log("data:", data);
  console.log("error:", error);
}

run();
