import { z } from "zod";

export const neighborhoodSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  avgPrice: z
    .number()
    .positive("Average price must be positive")
    .nullable()
    .optional(),
  imageUrl: z.string().url("Invalid image URL").nullable().optional(),
  block: z.string().max(255).nullable().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const neighborhoodUpdateSchema = neighborhoodSchema.partial();

export type NeighborhoodInput = z.infer<typeof neighborhoodSchema>;
export type NeighborhoodUpdateInput = z.infer<typeof neighborhoodUpdateSchema>;
