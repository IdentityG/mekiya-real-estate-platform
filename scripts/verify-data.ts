import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

async function verifyData() {
  const client = await pool.connect();
  
  try {
    console.log("🔍 Verifying database data...\n");

    // Check users
    const users = await client.query("SELECT id, email, name, role FROM users ORDER BY id");
    console.log(`👥 Users: ${users.rows.length} found`);
    users.rows.forEach(u => console.log(`   - ${u.name} (${u.email}) - ${u.role}`));
    
    // Check properties
    const properties = await client.query(`
      SELECT id, title, property_type, listing_type, status, price 
      FROM properties 
      ORDER BY id LIMIT 10
    `);
    console.log(`\n🏢 Properties: ${properties.rows.length} found`);
    properties.rows.forEach(p => {
      console.log(`   - ${p.title} (${p.property_type}, ${p.listing_type}) - ${p.status} - ${p.price} ETB`);
    });
    
    // Check neighborhoods
    const neighborhoods = await client.query("SELECT id, name FROM neighborhoods ORDER BY id");
    console.log(`\n🏘️  Neighborhoods: ${neighborhoods.rows.length} found`);
    neighborhoods.rows.forEach(n => console.log(`   - ${n.name}`));
    
    // Check testimonials
    const testimonials = await client.query("SELECT id, name, rating FROM testimonials ORDER BY id");
    console.log(`\n💬 Testimonials: ${testimonials.rows.length} found`);
    testimonials.rows.forEach(t => console.log(`   - ${t.name} (${t.rating}⭐)`));
    
    // Check RLS policies
    const policies = await client.query(`
      SELECT tablename, policyname 
      FROM pg_policies 
      WHERE schemaname = 'public' 
      ORDER BY tablename, policyname
      LIMIT 10
    `);
    console.log(`\n🔐 RLS Policies: ${policies.rows.length} sample policies`);
    policies.rows.forEach(p => console.log(`   - ${p.tablename}: ${p.policyname}`));
    
    console.log("\n✅ Data verification complete!\n");
    
  } catch (error) {
    console.error("❌ Error verifying data:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

verifyData().catch(console.error);
