#!/usr/bin/env tsx
/**
 * Migration: Add Virtual Tours and Enhanced Media Fields
 * 
 * Adds support for:
 * - 360° virtual tours
 * - Video tours
 * - Construction timeline tracking
 * - Google Street View integration
 * 
 * Usage: pnpm tsx scripts/migrate-virtual-tours.ts
 */

import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { db } from "@/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("🚀 Starting Virtual Tours & Enhanced Media migration...\n");

  try {
    // Add new columns
    console.log("📝 Adding virtual tour fields to properties table...");
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_360_url TEXT;
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_tour_url TEXT;
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_tour_thumbnail TEXT;
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS street_view_enabled BOOLEAN DEFAULT false;
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_status VARCHAR(50);
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_timeline JSONB DEFAULT '[]'::jsonb;
    `);
    await db.execute(sql`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP;
    `);

    console.log("✅ Virtual tour fields added successfully!\n");

    // Add comments
    console.log("📝 Adding column documentation...");
    await db.execute(sql`
      COMMENT ON COLUMN properties.virtual_tour_360_url IS '360° virtual tour URL (Pannellum, Matterport, etc.)';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.video_tour_url IS 'Video tour URL (YouTube, Vimeo, or direct video)';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.video_tour_thumbnail IS 'Thumbnail image for video tour';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.street_view_enabled IS 'Enable Google Street View integration';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.construction_status IS 'Construction status: completed, under_construction, or planned';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.construction_timeline IS 'Timeline array with phases, dates, descriptions, images, and progress';
    `);
    await db.execute(sql`
      COMMENT ON COLUMN properties.completion_date IS 'Expected completion date for under-construction properties';
    `);

    console.log("✅ Documentation added!\n");

    // Create indexes
    console.log("📝 Creating performance indexes...");
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS properties_construction_status_idx 
      ON properties(construction_status) 
      WHERE construction_status IS NOT NULL;
    `);

    console.log("✅ Indexes created!\n");

    console.log("✨ Migration completed successfully!\n");
    console.log("New features available:");
    console.log("  • 360° Virtual Tours");
    console.log("  • Video Tours");
    console.log("  • Construction Timeline Tracking");
    console.log("  • Google Street View Integration");
    console.log("\n📚 Update your property forms to include these new fields.\n");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
