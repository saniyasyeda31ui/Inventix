import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('warehouses').select('*');
  console.log("Warehouses:", data);
  
  const { data: catData } = await supabase.from('products').select('category');
  const uniqueCats = [...new Set(catData?.map(c => c.category))];
  console.log("Categories:", uniqueCats);
}

main();
