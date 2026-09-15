import * as dotenv from "dotenv";
import * as path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DIRECT_URL or DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function migrateSavedSearches() {
  console.log("🚀 Applying Saved Searches & Map Integration schema...\n");

  try {
    // Create saved_searches table
    console.log("📝 Creating saved_searches table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS saved_searches (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        search_criteria JSONB NOT NULL,
        email_alerts BOOLEAN DEFAULT true,
        last_alert_sent TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS saved_searches_user_id_idx ON saved_searches(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS saved_searches_email_alerts_idx ON saved_searches(email_alerts);
    `);

    // Create property_favorites table
    console.log("📝 Creating property_favorites table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS property_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, property_id)
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS property_favorites_user_id_idx ON property_favorites(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS property_favorites_property_id_idx ON property_favorites(property_id);
    `);

    // Create property_comparisons table
    console.log("📝 Creating property_comparisons table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS property_comparisons (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        property_ids JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS property_comparisons_user_id_idx ON property_comparisons(user_id);
    `);

    // Add spatial and search indexes
    console.log("📝 Creating search optimization indexes...");
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_lat_lng_idx ON properties(lat, lng) 
      WHERE lat IS NOT NULL AND lng IS NOT NULL;
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_price_idx ON properties(price);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_bedrooms_idx ON properties(bedrooms);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_size_idx ON properties(size);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_neighborhood_idx ON properties(neighborhood);
    `);

    console.log("\n✅ Migration complete! Saved Searches & Map Integration ready.");
    await pool.end();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

migrateSavedSearches()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
