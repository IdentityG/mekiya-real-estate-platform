import { z } from "zod";

export const propertySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(10, "Title must be at least 10 characters")
    .max(500, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  propertyType: z.enum(["apartment", "commercial"], {
    required_error: "Property type is required",
  }),
  listingType: z.enum(["sale", "rent"], {
    required_error: "Listing type is required",
  }),
  status: z.enum(["draft", "published", "reserved", "sold", "archived"], {
    required_error: "Status is required",
  }),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be positive")
    .max(1000000000, "Price is too high"),
  currency: z.string().default("ETB"),
  bedrooms: z.number().int().min(0).max(20).nullable().optional(),
  bathrooms: z.number().int().min(0).max(20).nullable().optional(),
  size: z.number().positive().max(100000).nullable().optional(),
  sizeUnit: z.string().default("sqm"),
  description: z.string().min(20, "Description must be at least 20 characters").nullable().optional(),
  address: z.string().min(1, "Address is required").nullable(),
  city: z.string().default("Addis Ababa"),
  neighborhood: z.string().nullable().optional(),
  block: z.string().nullable().optional(),
  amenities: z.array(z.string()).default([]),
  media: z.array(z.string().url("Invalid media URL")).default([]),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  furnished: z.boolean().nullable().optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 2).nullable().optional(),
  agentId: z.number().int().positive().nullable().optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

// Partial schema for updates
export const propertyUpdateSchema = propertySchema.partial();
