import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: pos, error } = await supabase.from('purchase_orders').select('*').in('status', ['Received', 'Completed']);
  console.log("Completed/Received POs:", pos);

  if (pos && pos.length > 0) {
    for (const po of pos) {
      if (po.purchase_request_id) {
        const { data: pr } = await supabase.from('purchase_requests').select('*').eq('id', po.purchase_request_id).single();
        console.log(`PR for PO ${po.po_number}:`, pr);
      } else {
        console.log(`PO ${po.po_number} HAS NO purchase_request_id linked.`);
      }
    }
  }
}

main();
