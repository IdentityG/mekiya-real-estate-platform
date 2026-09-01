import { Pool } from "pg";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import { config } from "dotenv";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

async function applyRLS() {
  const client = await pool.connect();
  
  try {
    console.log("🔐 Applying Row Level Security policies...\n");
    
    // Read the RLS SQL file
    const rlsSql = readFileSync(
      join(__dirname, "..", "drizzle", "0001_rls_policies.sql"),
      "utf-8"
    );
    
    // Execute the RLS policies
    await client.query(rlsSql);
    
    console.log("✅ RLS policies applied successfully!\n");
    console.log("📋 Applied policies for:");
    console.log("   • users");
    console.log("   • properties");
    console.log("   • visit_requests");
    console.log("   • leads");
    console.log("   • transactions");
    console.log("   • testimonials");
    console.log("   • neighborhoods");
    console.log("   • site_settings\n");
    
  } catch (error) {
    console.error("❌ Error applying RLS policies:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

applyRLS().catch(console.error);
