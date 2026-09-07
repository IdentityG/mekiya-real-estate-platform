import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", [
  "public",
  "agent",
  "sales_manager",
  "super_admin",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "draft",
  "published",
  "reserved",
  "sold",
  "archived",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "commercial",
]);

export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent"]);

export const visitStatusEnum = pgEnum("visit_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "visit_scheduled",
  "negotiating",
  "closed_won",
  "closed_lost",
]);

export const leadTypeEnum = pgEnum("lead_type", ["buy", "rent", "general"]);

export const txMethodEnum = pgEnum("tx_method", [
  "chapa",
  "stripe",
  "bank_transfer",
]);

export const txStatusEnum = pgEnum("tx_status", [
  "pending",
  "paid",
  "refunded",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("public"),
  phone: varchar("phone", { length: 50 }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  specialty: varchar("specialty", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  propertyType: propertyTypeEnum("property_type").notNull().default("apartment"),
  listingType: listingTypeEnum("listing_type").notNull().default("sale"),
  status: propertyStatusEnum("status").notNull().default("draft"),
  price: doublePrecision("price").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("ETB"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  size: doublePrecision("size"),
  sizeUnit: varchar("size_unit", { length: 20 }).default("sqm"),
  description: text("description"),
  address: text("address"),
  city: varchar("city", { length: 255 }).default("Addis Ababa"),
  neighborhood: varchar("neighborhood", { length: 255 }),
  block: varchar("block", { length: 255 }),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  media: jsonb("media").$type<string[]>().default([]),
  agentId: integer("agent_id").references(() => users.id),
  featured: boolean("featured").default(false),
  verified: boolean("verified").default(false),
  views: integer("views").default(0),
  yearBuilt: integer("year_built"),
  furnished: boolean("furnished").default(false),
  metaTitle: varchar("meta_title", { length: 500 }),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visitRequests = pgTable("visit_requests", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .references(() => properties.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  requestedDate: varchar("requested_date", { length: 20 }).notNull(),
  requestedTime: varchar("requested_time", { length: 20 }),
  message: text("message"),
  status: visitStatusEnum("status").notNull().default("pending"),
  assignedAgentId: integer("assigned_agent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  leadType: leadTypeEnum("lead_type").notNull().default("general"),
  pipelineStatus: leadStatusEnum("pipeline_status").notNull().default("new"),
  source: varchar("source", { length: 100 }),
  notes: jsonb("notes").$type<Array<{ date: string; text: string }>>().default([]),
  assignedAgentId: integer("assigned_agent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  visitRequestId: integer("visit_request_id").references(() => visitRequests.id),
  amount: doublePrecision("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("ETB"),
  method: txMethodEnum("method").notNull(),
  status: txStatusEnum("status").notNull().default("pending"),
  reference: varchar("reference", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  avatarUrl: text("avatar_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  avgPrice: doublePrecision("avg_price"),
  imageUrl: text("image_url"),
  block: varchar("block", { length: 255 }),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const propertyTypes = pgTable("property_types", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }).default("Building2"),
  imageUrl: text("image_url"),
  color: varchar("color", { length: 20 }).default("#C4A96B"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
