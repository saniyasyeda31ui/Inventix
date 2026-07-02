/**
 * RLS diagnostic script for ai_recommendations
 * Run with: node scripts/check_rls.mjs
 * 
 * Tests:
 *  1. Anon key SELECT → should return 0 if RLS blocks anon
 *  2. pg_policies catalog via RPC (if a helper function exists)
 *  3. Schema introspection endpoint
 */

const SUPABASE_URL = "https://guuzayfrndktrsaakscx.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ";

const headers = {
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json"
};

async function run() {
  console.log("=".repeat(60));
  console.log("Supabase RLS Diagnostic for: ai_recommendations");
  console.log("=".repeat(60));

  // ── Test 1: Anon SELECT (no auth session) ──────────────────────
  console.log("\n[1] Anon key SELECT (unauthenticated) ...");
  try {
    const r1 = await fetch(`${SUPABASE_URL}/rest/v1/ai_recommendations?select=id,status,item`, { headers });
    const body1 = await r1.json();
    console.log(`    HTTP ${r1.status}`);
    if (r1.ok) {
      console.log(`    Rows returned: ${body1.length}`);
      if (body1.length > 0) {
        console.log("    ✅ RLS is NOT blocking anon reads (or no RLS)");
        console.log("    Sample row:", JSON.stringify(body1[0]));
      } else {
        console.log("    ⚠️  0 rows — RLS is active and blocking anon access");
        console.log("       (Table has data but anon role has no SELECT policy)");
      }
    } else {
      console.log("    ❌ Error body:", JSON.stringify(body1));
    }
  } catch (e) {
    console.log("    Network error:", e.message);
  }

  // ── Test 2: Anon SELECT with Content-Range to get total count ──
  console.log("\n[2] COUNT check (Prefer: count=exact) ...");
  try {
    const r2 = await fetch(`${SUPABASE_URL}/rest/v1/ai_recommendations?select=*`, {
      headers: { ...headers, "Prefer": "count=exact" }
    });
    const cr = r2.headers.get("Content-Range");
    const body2 = await r2.json();
    console.log(`    HTTP ${r2.status}`);
    console.log(`    Content-Range: ${cr ?? "(not returned)"}`);
    // Content-Range: 0-3/4  means 4 total rows visible to this role
    // Content-Range: */0    means 0 rows visible
  } catch (e) {
    console.log("    Network error:", e.message);
  }

  // ── Test 3: Try to read pg_policies via built-in view ──────────
  // Supabase exposes some pg_catalog tables via the API.
  // If the anon key can't read these, we'll get a 42501 error.
  console.log("\n[3] Attempting to read pg_policies via REST ...");
  try {
    const r3 = await fetch(
      `${SUPABASE_URL}/rest/v1/pg_policies?tablename=eq.ai_recommendations&select=policyname,cmd,roles,qual,with_check`,
      { headers }
    );
    const body3 = await r3.json();
    console.log(`    HTTP ${r3.status}`);
    if (r3.ok && Array.isArray(body3) && body3.length > 0) {
      console.log(`    Found ${body3.length} RLS policies:`);
      body3.forEach((p, i) => {
        console.log(`    [${i+1}] Name: "${p.policyname}"`);
        console.log(`         Command: ${p.cmd}`);
        console.log(`         Roles: ${JSON.stringify(p.roles)}`);
        console.log(`         USING: ${p.qual}`);
        console.log(`         WITH CHECK: ${p.with_check}`);
      });
    } else if (r3.ok && Array.isArray(body3) && body3.length === 0) {
      console.log("    ⚠️  NO POLICIES FOUND on ai_recommendations");
      console.log("       RLS may be enabled but with zero policies → all reads blocked");
    } else {
      console.log("    Could not read pg_policies:", JSON.stringify(body3));
    }
  } catch (e) {
    console.log("    Network error:", e.message);
  }

  // ── Test 4: Check if table appears in anon schema ───────────────
  console.log("\n[4] Schema introspection (is table visible to anon?) ...");
  try {
    const r4 = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers });
    const body4 = await r4.json();
    const paths = Object.keys(body4?.paths ?? {});
    const visible = paths.some(p => p.includes("ai_recommendations"));
    console.log(`    HTTP ${r4.status}`);
    console.log(`    ai_recommendations in exposed schema: ${visible ? "YES ✅" : "NO ❌"}`);
  } catch (e) {
    console.log("    Network error:", e.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Diagnostic complete.");
}

run();
