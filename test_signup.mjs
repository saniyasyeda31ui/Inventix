import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://guuzayfrndktrsaakscx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ'
);

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: `test_admin_${Date.now()}@gmail.com`,
    password: 'password1234',
    options: {
      data: {
        full_name: 'Test Admin',
        role: 'admin',
        organization: 'TimberCraft Furnishings Pvt. Ltd.'
      }
    }
  });

  if (error) {
    console.log('--- ERROR OBJECT ---');
    console.log(error);
  } else {
    console.log('--- SUCCESS ---');
    console.log('User ID:', data.user?.id);
    
    // Check if profile was created
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id);
      
      console.log('--- PROFILE ---');
      console.log(profile);
      if (profileError) console.error('Profile Error:', profileError);
    }
  }
}

run();
