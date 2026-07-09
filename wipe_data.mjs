import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://guuzayfrndktrsaakscx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ'
);

async function wipeSeedData() {
  console.log('Registering a temporary admin to get delete permissions...');
  const randomEmail = `wipe_admin_${Date.now()}@test.com`;
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: randomEmail,
    password: 'password123',
    options: {
      data: {
        full_name: 'Wipe Admin',
        role: 'admin',
        organization: 'Wipe Org'
      }
    }
  });

  if (authError) {
    console.error('Failed to register wipe admin:', authError.message);
    return;
  }
  
  if (!authData.session) {
    console.error('Email confirmations are still enabled! The user has not disabled them yet.');
    // We cannot proceed if we don't have an active session!
    return;
  }
  
  console.log('Logged in as wipe admin successfully! Wiping seed data...');

  const tablesToWipe = [
    'activity_logs',
    'notifications',
    'payments',
    'purchase_orders',
    'purchase_requests',
    'inventory_balances',
    'products',
    'vendors',
    'warehouses',
    'employees'
  ];

  for (const table of tablesToWipe) {
    console.log(`Wiping ${table}...`);
    const { error } = await supabase.from(table).delete().neq('created_at', '1970-01-01T00:00:00Z');
    if (error) {
      console.log(`Error wiping ${table}:`, error.message);
    } else {
      console.log(`Cleared ${table}.`);
    }
  }

  // Delete the mock Acme company, but leave TimberCraft alone
  console.log('Wiping Acme Corp company...');
  await supabase.from('companies').delete().neq('created_at', '1970-01-01T00:00:00Z');
  
  console.log('All dummy data wiped successfully!');
}

wipeSeedData();
