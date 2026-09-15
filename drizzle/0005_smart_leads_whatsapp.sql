-- Feature 3: Smart Lead Management & WhatsApp Integration
-- Add WhatsApp/Telegram fields to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp_phone" VARCHAR(50);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telegram_username" VARCHAR(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "language_preference" VARCHAR(10) DEFAULT 'en';

-- Add smart lead management fields to leads
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "lead_score" INTEGER DEFAULT 0;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "last_activity_at" TIMESTAMP;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "view_count" INTEGER DEFAULT 0;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "whatsapp_opt_in" BOOLEAN DEFAULT false;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "sms_opt_in" BOOLEAN DEFAULT true;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "language_preference" VARCHAR(10) DEFAULT 'en';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "interested_property_types" JSONB DEFAULT '[]';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "budget_min" DOUBLE PRECISION;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "budget_max" DOUBLE PRECISION;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "preferred_neighborhoods" JSONB DEFAULT '[]';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "next_follow_up_date" TIMESTAMP;

-- Create lead activity type enum
DO $$ BEGIN
  CREATE TYPE "lead_activity_type" AS ENUM (
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

-- Create lead activities table
CREATE TABLE IF NOT EXISTS "lead_activities" (
  "id" SERIAL PRIMARY KEY,
  "lead_id" INTEGER NOT NULL REFERENCES "leads"("id") ON DELETE CASCADE,
  "activity_type" "lead_activity_type" NOT NULL,
  "property_id" INTEGER REFERENCES "properties"("id"),
  "metadata" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "lead_activities_lead_id_idx" ON "lead_activities"("lead_id");
CREATE INDEX IF NOT EXISTS "lead_activities_created_at_idx" ON "lead_activities"("created_at" DESC);

-- Create notification type enum
DO $$ BEGIN
  CREATE TYPE "notification_type" AS ENUM ('sms', 'email', 'whatsapp', 'in_app');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create notification status enum
DO $$ BEGIN
  CREATE TYPE "notification_status" AS ENUM ('pending', 'sent', 'failed', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" SERIAL PRIMARY KEY,
  "recipient_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" "notification_type" NOT NULL,
  "status" "notification_status" DEFAULT 'pending' NOT NULL,
  "subject" VARCHAR(255),
  "message" TEXT NOT NULL,
  "metadata" JSONB DEFAULT '{}',
  "scheduled_for" TIMESTAMP,
  "sent_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "notifications_recipient_id_idx" ON "notifications"("recipient_id");
CREATE INDEX IF NOT EXISTS "notifications_status_idx" ON "notifications"("status");
CREATE INDEX IF NOT EXISTS "notifications_scheduled_for_idx" ON "notifications"("scheduled_for");

-- Create property recommendations table
CREATE TABLE IF NOT EXISTS "property_recommendations" (
  "id" SERIAL PRIMARY KEY,
  "lead_id" INTEGER NOT NULL REFERENCES "leads"("id") ON DELETE CASCADE,
  "property_id" INTEGER NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
  "score" DOUBLE PRECISION NOT NULL,
  "reason" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "property_recommendations_lead_id_idx" ON "property_recommendations"("lead_id");
CREATE INDEX IF NOT EXISTS "property_recommendations_score_idx" ON "property_recommendations"("score" DESC);

-- Create indexes for lead scoring and filtering
CREATE INDEX IF NOT EXISTS "leads_lead_score_idx" ON "leads"("lead_score" DESC);
CREATE INDEX IF NOT EXISTS "leads_last_activity_at_idx" ON "leads"("last_activity_at" DESC);
CREATE INDEX IF NOT EXISTS "leads_next_follow_up_date_idx" ON "leads"("next_follow_up_date");
CREATE INDEX IF NOT EXISTS "leads_assigned_agent_id_idx" ON "leads"("assigned_agent_id");

COMMENT ON TABLE "lead_activities" IS 'Tracks all lead interactions for activity scoring';
COMMENT ON TABLE "notifications" IS 'Manages SMS, email, WhatsApp notifications to agents and leads';
COMMENT ON TABLE "property_recommendations" IS 'AI-powered property recommendations based on lead behavior';
COMMENT ON COLUMN "leads"."lead_score" IS 'Calculated score based on lead engagement (0-100)';
COMMENT ON COLUMN "leads"."whatsapp_opt_in" IS 'Whether lead opted in for WhatsApp messages';
