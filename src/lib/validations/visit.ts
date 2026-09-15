import { z } from "zod";

export const visitRequestSchema = z.object({
  propertyId: z.number().int().positive("Property is required"),
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
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.enum(["morning", "afternoon", "evening"]),
  message: z.string().max(1000, "Message is too long").nullable().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
});

export const visitUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  notes: z.string().max(1000).nullable().optional(),
});

export type VisitRequestInput = z.infer<typeof visitRequestSchema>;
export type VisitUpdateInput = z.infer<typeof visitUpdateSchema>;
