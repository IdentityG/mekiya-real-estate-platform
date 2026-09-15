import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^(\+251|0)[0-9]{9}$/, "Invalid Ethiopian phone number"),
  leadType: z.enum(["buy", "rent", "general"]),
  status: z.enum([
    "new",
    "contacted",
    "visit_scheduled",
    "negotiating",
    "closed_won",
    "closed_lost",
  ]).default("new"),
  budget: z.number().positive().nullable().optional(),
  message: z.string().max(1000, "Message is too long").nullable().optional(),
  source: z.string().max(100).nullable().optional(),
  assignedToId: z.number().int().positive().nullable().optional(),
});

export const leadUpdateSchema = leadSchema.partial().extend({
  notes: z.string().max(2000).nullable().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
