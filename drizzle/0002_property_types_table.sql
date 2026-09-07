-- Create property_types table for dynamic management
CREATE TABLE IF NOT EXISTS "property_types" (
  "id" serial PRIMARY KEY NOT NULL,
  "value" varchar(50) NOT NULL UNIQUE,
  "label" varchar(100) NOT NULL,
  "description" text,
  "icon" varchar(50) DEFAULT 'Building2',
  "image_url" text,
  "color" varchar(20) DEFAULT '#C4A96B',
  "is_active" boolean DEFAULT true,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default property types (migrating from enum)
INSERT INTO "property_types" ("value", "label", "description", "icon", "sort_order", "is_active") VALUES
  ('apartment', 'Apartment', 'Residential apartments and condominiums', 'Home', 0, true),
  ('commercial', 'Commercial', 'Office spaces, retail, and business properties', 'Building2', 1, true)
ON CONFLICT (value) DO NOTHING;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS "property_types_value_idx" ON "property_types" ("value");
CREATE INDEX IF NOT EXISTS "property_types_is_active_idx" ON "property_types" ("is_active");
