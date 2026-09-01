import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

async function reset() {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Starting database reset...\n");
    
    // Confirm with user (in production, you'd want a --force flag)
    console.log("⚠️  WARNING: This will delete ALL data in your database!");
    console.log("    Press Ctrl+C to cancel, or wait 3 seconds to continue...\n");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("🗑️  Dropping all tables...");
    
    // Drop tables in reverse order of dependencies
    await client.query(`
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS leads CASCADE;
      DROP TABLE IF EXISTS visit_requests CASCADE;
      DROP TABLE IF EXISTS properties CASCADE;
      DROP TABLE IF EXISTS testimonials CASCADE;
      DROP TABLE IF EXISTS neighborhoods CASCADE;
      DROP TABLE IF EXISTS site_settings CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    console.log("🗑️  Dropping enums...");
    
    await client.query(`
      DROP TYPE IF EXISTS tx_status CASCADE;
      DROP TYPE IF EXISTS tx_method CASCADE;
      DROP TYPE IF EXISTS lead_type CASCADE;
      DROP TYPE IF EXISTS lead_status CASCADE;
      DROP TYPE IF EXISTS visit_status CASCADE;
      DROP TYPE IF EXISTS listing_type CASCADE;
      DROP TYPE IF EXISTS property_type CASCADE;
      DROP TYPE IF EXISTS property_status CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
    `);
    
    console.log("🗑️  Dropping helper functions...");
    
    await client.query(`
      DROP FUNCTION IF EXISTS get_user_role() CASCADE;
      DROP FUNCTION IF EXISTS get_user_id() CASCADE;
      DROP FUNCTION IF EXISTS is_staff() CASCADE;
    `);
    
    console.log("\n✅ Database reset complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: pnpm db:push");
    console.log("   2. Apply RLS policies manually in Supabase SQL Editor");
    console.log("   3. Run: pnpm db:seed\n");
    
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

reset().catch(console.error);
