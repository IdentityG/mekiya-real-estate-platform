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

async function migrateSmartLeads() {
  console.log("🚀 Applying Smart Leads & WhatsApp Integration schema...\n");

  try {
    // Add columns to users table
    console.log("📝 Adding WhatsApp/Telegram fields to users...");
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_phone VARCHAR(50);
    `);
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(100);
    `);
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';
    `);

    // Add columns to leads table
    console.log("📝 Adding smart lead management fields to leads...");
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT false;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT true;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS interested_property_types JSONB DEFAULT '[]';
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_min DOUBLE PRECISION;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_max DOUBLE PRECISION;
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_neighborhoods JSONB DEFAULT '[]';
    `);
    await db.execute(sql`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_follow_up_date TIMESTAMP;
    `);

    // Create enums
    console.log("📝 Creating enums...");
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE lead_activity_type AS ENUM (
          'property_view',
          'property_favorite',
          'contact_whatsapp',
          'contact_phone',
          'contact_email',
          'visit_request',
          'search',
          'compare_properties',
          'agent_note'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE notification_type AS ENUM ('sms', 'email', 'whatsapp', 'in_app');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'delivered');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create lead_activities table
    console.log("📝 Creating lead_activities table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lead_activities (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        activity_type lead_activity_type NOT NULL,
        property_id INTEGER REFERENCES properties(id),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS lead_activities_lead_id_idx ON lead_activities(lead_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS lead_activities_created_at_idx ON lead_activities(created_at DESC);
    `);

    // Create notifications table
    console.log("📝 Creating notifications table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type notification_type NOT NULL,
        status notification_status DEFAULT 'pending' NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        scheduled_for TIMESTAMP,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS notifications_recipient_id_idx ON notifications(recipient_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS notifications_status_idx ON notifications(status);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS notifications_scheduled_for_idx ON notifications(scheduled_for);
    `);

    // Create property_recommendations table
    console.log("📝 Creating property_recommendations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS property_recommendations (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        score DOUBLE PRECISION NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS property_recommendations_lead_id_idx ON property_recommendations(lead_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS property_recommendations_score_idx ON property_recommendations(score DESC);
    `);

    // Create indexes for leads
    console.log("📝 Creating indexes for lead scoring...");
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS leads_lead_score_idx ON leads(lead_score DESC);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS leads_last_activity_at_idx ON leads(last_activity_at DESC);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS leads_next_follow_up_date_idx ON leads(next_follow_up_date);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS leads_assigned_agent_id_idx ON leads(assigned_agent_id);
    `);

    console.log("\n✅ Migration complete! Smart Leads & WhatsApp Integration ready.");
    await pool.end();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

migrateSmartLeads()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
