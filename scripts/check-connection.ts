import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

async function checkConnection() {
  console.log("🔍 Checking database connection...\n");
  
  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}`);
  console.log(`   DIRECT_URL: ${process.env.DIRECT_URL ? "✅ Set" : "❌ Missing"}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}\n`);
  
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    console.error("❌ No database URL found in environment variables!");
    console.log("\n💡 Make sure you have .env.local file with DATABASE_URL set.");
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to database!\n");
    
    // Get database info
    const result = await client.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    
    console.log("📊 Database Info:");
    console.log(`   Database: ${result.rows[0].database}`);
    console.log(`   User: ${result.rows[0].user}`);
    console.log(`   Version: ${result.rows[0].version.split(',')[0]}\n`);
    
    // Check if tables exist
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    
    if (tables.rows.length > 0) {
      console.log("📚 Existing Tables:");
      tables.rows.forEach(row => console.log(`   • ${row.tablename}`));
      console.log("");
    } else {
      console.log("📚 No tables found (database is empty)\n");
    }
    
    client.release();
    console.log("✅ Connection check complete!\n");
    
  } catch (error) {
    console.error("❌ Failed to connect to database:");
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkConnection().catch(console.error);
