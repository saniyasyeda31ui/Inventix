import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://guuzayfrndktrsaakscx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.functions.invoke('provision-user', {
    method: 'POST',
    body: { action: 'provisionUser', email: '', full_name: '', role: '' }
  });

  if (error) {
     try {
       const body = await error.context.json();
       console.log("Body JSON:", JSON.stringify(body));
       console.log("body.error:", body.error);
       console.log("body.details:", body.details);
       console.log("Evaluated Error to throw:", body.error || body.details || JSON.stringify(body));
     } catch (e) {
       console.log("Failed to parse JSON:", e);
     }
  }
}

run();
