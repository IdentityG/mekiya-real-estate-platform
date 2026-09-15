-- Feature 1: Advanced Search & Map Integration
-- Saved Searches, Property Favorites, Property Comparisons

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS "saved_searches" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "search_criteria" JSONB NOT NULL,
  "email_alerts" BOOLEAN DEFAULT true,
  "last_alert_sent" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "saved_searches_user_id_idx" ON "saved_searches"("user_id");
CREATE INDEX IF NOT EXISTS "saved_searches_email_alerts_idx" ON "saved_searches"("email_alerts");

-- Create property_favorites table
CREATE TABLE IF NOT EXISTS "property_favorites" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "property_id" INTEGER NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("user_id", "property_id")
);

CREATE INDEX IF NOT EXISTS "property_favorites_user_id_idx" ON "property_favorites"("user_id");
CREATE INDEX IF NOT EXISTS "property_favorites_property_id_idx" ON "property_favorites"("property_id");

-- Create property_comparisons table
CREATE TABLE IF NOT EXISTS "property_comparisons" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "property_ids" JSONB NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "property_comparisons_user_id_idx" ON "property_comparisons"("user_id");

-- Add spatial index for lat/lng on properties (for proximity search)
CREATE INDEX IF NOT EXISTS "properties_lat_lng_idx" ON "properties"(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- Add indexes for common search filters on properties
CREATE INDEX IF NOT EXISTS "properties_price_idx" ON "properties"("price");
CREATE INDEX IF NOT EXISTS "properties_bedrooms_idx" ON "properties"("bedrooms");
CREATE INDEX IF NOT EXISTS "properties_size_idx" ON "properties"("size");
CREATE INDEX IF NOT EXISTS "properties_neighborhood_idx" ON "properties"("neighborhood");

COMMENT ON TABLE "saved_searches" IS 'User saved property searches with email alert preferences';
COMMENT ON TABLE "property_favorites" IS 'User favorited/bookmarked properties';
COMMENT ON TABLE "property_comparisons" IS 'Property comparison sessions for users';
COMMENT ON COLUMN "saved_searches"."search_criteria" IS 'JSON object with search filters (propertyType, price, bedrooms, location, etc.)';
COMMENT ON COLUMN "saved_searches"."email_alerts" IS 'Whether user wants email alerts for new matching properties';
