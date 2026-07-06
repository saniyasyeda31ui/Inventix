import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://guuzayfrndktrsaakscx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Invoking edge function...");
  const { data, error } = await supabase.functions.invoke('provision-user', {
    method: 'POST',
    body: { action: 'provisionUser', email: '', full_name: '', role: '' }
  });

  console.log("Data:", data);
  console.log("Error object:", error);
  console.log("Error constructor:", error?.constructor?.name);
  if (error) {
     console.log("Error stringified:", JSON.stringify(error));
     console.log("Error Object.keys:", Object.keys(error));
     console.log("Is FunctionsHttpError?", error.name === 'FunctionsHttpError');
  }
}

run();
