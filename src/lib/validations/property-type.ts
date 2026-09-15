import { z } from "zod";

export const propertyTypeSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .regex(/^[a-z_]+$/, "Value must be lowercase with underscores only")
    .max(50, "Value is too long"),
  label: z
    .string()
    .min(1, "Label is required")
    .min(2, "Label must be at least 2 characters")
    .max(100, "Label is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .nullable()
    .optional(),
  icon: z.string().max(50).nullable().optional(),
  imageUrl: z.string().url("Invalid image URL").nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color hex code").nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const propertyTypeUpdateSchema = propertyTypeSchema.partial();

export type PropertyTypeInput = z.infer<typeof propertyTypeSchema>;
export type PropertyTypeUpdateInput = z.infer<typeof propertyTypeUpdateSchema>;
