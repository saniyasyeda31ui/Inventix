const SUPABASE_URL = "https://guuzayfrndktrsaakscx.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXpheWZybmRrdHJzYWFrc2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDAzNjQsImV4cCI6MjA5ODM3NjM2NH0.T31zxrqOIm6NvjHNvK8M_Rvu8QPiLRcUHnh9uvmwURQ";

const headers = {
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json"
};

const tables = [
  "vendors",
  "warehouses",
  "inventory_balances",
  "purchase_requests",
  "purchase_orders",
  "payments",
  "employees",
  "saved_reports"
];

async function run() {
  for (const table of tables) {
    console.log(`\n============== TABLE: ${table} ==============`);
    
    // Fetch 1 row to get columns
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, { headers });
      const data = await res.json();
      
      if (res.ok && Array.isArray(data) && data.length > 0) {
        console.log(`Columns found:`);
        const row = data[0];
        for (const [key, value] of Object.entries(row)) {
          console.log(`  - ${key}: ${typeof value} (example: ${value})`);
        }
      } else if (res.ok && Array.isArray(data) && data.length === 0) {
        console.log(`Table is empty or RLS blocks SELECT.`);
      } else {
        console.log(`Failed to fetch row:`, data);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

run().catch(console.error);
