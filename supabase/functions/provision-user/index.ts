import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    return new Response(JSON.stringify({ step: 'Initialize', error: 'Server misconfiguration', details: null }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  
  const supabaseClient = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Authenticate admin
  let user;
  try {
    console.log('Authenticating admin...');
    const { data, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !data.user) {
      throw userError || new Error('No user found');
    }
    user = data.user;
    console.log('Admin authenticated:', user.id);
  } catch (error: any) {
    console.error('Error in Authenticate admin:', error);
    return new Response(
      JSON.stringify({
        step: "Authenticate admin",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check admin role
  let profile;
  try {
    console.log('Checking admin role for:', user.id);
    const { data, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || data.role !== 'admin') {
      throw profileError || new Error('User is not admin');
    }
    profile = data;
    console.log('Admin role verified:', profile.role);
  } catch (error: any) {
    console.error('Error in Check admin role:', error);
    return new Response(
      JSON.stringify({
        step: "Check admin role",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ step: 'Method validation', error: `Method ${req.method} not supported`, details: null }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Parse request body
  let payload;
  try {
    console.log('Parsing request body...');
    payload = await req.json();
    console.log('Request body parsed successfully.');
  } catch (error: any) {
    console.error('Error in Parse request body:', error);
    return new Response(
      JSON.stringify({
        step: "Parse request body",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (payload.action === 'deleteUser') {
    const { userId } = payload;
    
    // Validate payload
    try {
      console.log('Validating deleteUser payload...');
      if (!userId) throw new Error('Missing userId');
      if (userId === user.id) throw new Error('Cannot delete yourself');
      console.log('deleteUser payload validated for userId:', userId);
    } catch (error: any) {
      console.error('Error in Validate payload:', error);
      return new Response(
        JSON.stringify({
          step: "Validate payload",
          error: error?.message ?? String(error),
          details: error
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete employee
    try {
      console.log('Attempting to delete employee record for:', userId);
      const { error: employeeDeleteError, data } = await supabaseAdmin.from('employees').delete().eq('user_id', userId);
      if (employeeDeleteError) throw employeeDeleteError;
      console.log('Employee record deleted successfully, data:', data);
    } catch (error: any) {
      console.error('Error in Delete employee:', error);
      return new Response(
        JSON.stringify({
          step: "Delete employee",
          error: error?.message ?? String(error),
          details: error
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete profile
    try {
      console.log('Attempting to delete profile record for:', userId);
      const { error: profileDeleteError, data } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
      if (profileDeleteError) throw profileDeleteError;
      console.log('Profile record deleted successfully, data:', data);
    } catch (error: any) {
      console.error('Error in Delete profile:', error);
      return new Response(
        JSON.stringify({
          step: "Delete profile",
          error: error?.message ?? String(error),
          details: error
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete Auth user
    try {
      console.log('Attempting to delete Auth user for:', userId);
      const { error: deleteError, data } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;
      console.log('Auth user deleted successfully, data:', data);
    } catch (error: any) {
      console.error('Error in Delete Auth user:', error);
      return new Response(
        JSON.stringify({
          step: "Delete Auth user",
          error: error?.message ?? String(error),
          details: error
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Return success
    try {
      console.log('Returning success for deleteUser...');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error: any) {
       return new Response(JSON.stringify({ step: "Return success", error: error?.message ?? String(error), details: error }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  // Provision User Workflow
  const { email, full_name, department, title, role, status, redirectTo } = payload;
  
  // Validate payload
  try {
    console.log('Validating provisionUser payload...');
    if (!email || !full_name || !role) {
      throw new Error('Missing required fields (email, full_name, role)');
    }
    console.log('provisionUser payload validated.');
  } catch (error: any) {
    console.error('Error in Validate payload:', error);
    return new Response(
      JSON.stringify({
        step: "Validate payload",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // inviteUserByEmail()
  let newUser;
  try {
    console.log('Attempting to inviteUserByEmail for:', email);
    const { data: inviteData, error: createError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name,
        role,
        department: department || 'Operations',
        title: title || 'Staff',
        status: status || 'Active'
      },
      redirectTo: redirectTo || 'http://localhost:3000/accept-invitation'
    });

    if (createError) {
      if (createError.message.includes('already been registered') || createError.message.includes('already exists')) {
        // We throw a specific error here to be caught, or we can just return a Response
        return new Response(JSON.stringify({ error: "A user with this email already exists." }), {
           status: 409,
           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw createError;
    }

    if (!inviteData.user) {
      throw new Error('No user returned after creation.');
    }
    newUser = inviteData.user;
    console.log('inviteUserByEmail successful, data:', inviteData);
  } catch (error: any) {
    console.error('Error in inviteUserByEmail():', error);
    return new Response(
      JSON.stringify({
        step: "inviteUserByEmail()",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Insert employees
  try {
    console.log('Attempting to insert employee record for:', newUser.id);
    const { data, error: employeeError } = await supabaseAdmin.from('employees').insert({
      user_id: newUser.id,
      full_name: full_name,
      work_email: email,
      department: department || 'Operations',
      title: title || 'Staff',
      status: status || 'Active',
    });

    if (employeeError) {
      throw employeeError;
    }
    console.log('Employee record inserted successfully, data:', data);
  } catch (error: any) {
    console.error('Error in Insert employees:', error);
    return new Response(
      JSON.stringify({
        step: "Insert employees",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Return success
  try {
    console.log('Returning success for provisionUser...');
    return new Response(
      JSON.stringify({ success: true, user: newUser }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        step: "Return success",
        error: error?.message ?? String(error),
        details: error
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
