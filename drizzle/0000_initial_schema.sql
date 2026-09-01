-- Initial Mekiya Real Estate Platform Schema
-- Generated for Supabase PostgreSQL

-- Create enums
CREATE TYPE "public"."user_role" AS ENUM('public', 'agent', 'sales_manager', 'super_admin');
CREATE TYPE "public"."property_status" AS ENUM('draft', 'published', 'reserved', 'sold', 'archived');
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'commercial');
CREATE TYPE "public"."listing_type" AS ENUM('sale', 'rent');
CREATE TYPE "public"."visit_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'visit_scheduled', 'negotiating', 'closed_won', 'closed_lost');
CREATE TYPE "public"."lead_type" AS ENUM('buy', 'rent', 'general');
CREATE TYPE "public"."tx_method" AS ENUM('chapa', 'stripe', 'bank_transfer');
CREATE TYPE "public"."tx_status" AS ENUM('pending', 'paid', 'refunded');

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'public' NOT NULL,
	"phone" varchar(50),
	"avatar_url" text,
	"bio" text,
	"specialty" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "public"."properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"property_type" "property_type" DEFAULT 'apartment' NOT NULL,
	"listing_type" "listing_type" DEFAULT 'sale' NOT NULL,
	"status" "property_status" DEFAULT 'draft' NOT NULL,
	"price" double precision NOT NULL,
	"currency" varchar(10) DEFAULT 'ETB' NOT NULL,
	"bedrooms" integer,
	"bathrooms" integer,
	"size" double precision,
	"size_unit" varchar(20) DEFAULT 'sqm',
	"description" text,
	"address" text,
	"city" varchar(255) DEFAULT 'Addis Ababa',
	"neighborhood" varchar(255),
	"block" varchar(255),
	"lat" double precision,
	"lng" double precision,
	"amenities" jsonb DEFAULT '[]'::jsonb,
	"media" jsonb DEFAULT '[]'::jsonb,
	"agent_id" integer,
	"featured" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"year_built" integer,
	"furnished" boolean DEFAULT false,
	"meta_title" varchar(500),
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "public"."visit_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"requested_date" varchar(20) NOT NULL,
	"requested_time" varchar(20),
	"message" text,
	"status" "visit_status" DEFAULT 'pending' NOT NULL,
	"assigned_agent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"lead_type" "lead_type" DEFAULT 'general' NOT NULL,
	"pipeline_status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" varchar(100),
	"notes" jsonb DEFAULT '[]'::jsonb,
	"assigned_agent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"visit_request_id" integer,
	"amount" double precision NOT NULL,
	"currency" varchar(10) DEFAULT 'ETB',
	"method" "tx_method" NOT NULL,
	"status" "tx_status" DEFAULT 'pending' NOT NULL,
	"reference" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"content" text NOT NULL,
	"rating" integer DEFAULT 5,
	"avatar_url" text,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."neighborhoods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"avg_price" double precision,
	"image_url" text,
	"block" varchar(255),
	"lat" double precision,
	"lng" double precision,
	CONSTRAINT "neighborhoods_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "public"."site_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create foreign key constraints
DO $$ BEGIN
 ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."visit_requests" ADD CONSTRAINT "visit_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."visit_requests" ADD CONSTRAINT "visit_requests_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_visit_request_id_visit_requests_id_fk" FOREIGN KEY ("visit_request_id") REFERENCES "public"."visit_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_properties_status" ON "public"."properties" ("status");
CREATE INDEX IF NOT EXISTS "idx_properties_agent" ON "public"."properties" ("agent_id");
CREATE INDEX IF NOT EXISTS "idx_properties_featured" ON "public"."properties" ("featured");
CREATE INDEX IF NOT EXISTS "idx_properties_city" ON "public"."properties" ("city");
CREATE INDEX IF NOT EXISTS "idx_visit_requests_property" ON "public"."visit_requests" ("property_id");
CREATE INDEX IF NOT EXISTS "idx_visit_requests_status" ON "public"."visit_requests" ("status");
CREATE INDEX IF NOT EXISTS "idx_leads_assigned_agent" ON "public"."leads" ("assigned_agent_id");
CREATE INDEX IF NOT EXISTS "idx_leads_status" ON "public"."leads" ("pipeline_status");
