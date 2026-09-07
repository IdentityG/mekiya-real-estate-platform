-- Add featured and metadata fields to neighborhoods
ALTER TABLE "neighborhoods" 
ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL,
ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

-- Create index for featured neighborhoods
CREATE INDEX IF NOT EXISTS "neighborhoods_featured_idx" ON "neighborhoods" ("featured");
CREATE INDEX IF NOT EXISTS "neighborhoods_sort_order_idx" ON "neighborhoods" ("sort_order");
