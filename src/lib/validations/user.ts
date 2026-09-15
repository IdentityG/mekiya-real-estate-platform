import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z.enum(["public", "agent", "sales_manager", "super_admin"]),
  phone: z
    .string()
    .regex(/^(\+251|0)[0-9]{9}$/, "Invalid Ethiopian phone number")
    .nullable()
    .optional(),
  avatarUrl: z.string().url("Invalid avatar URL").nullable().optional(),
  bio: z
    .string()
    .max(1000, "Bio is too long")
    .nullable()
    .optional(),
  specialty: z
    .string()
    .max(255, "Specialty is too long")
    .nullable()
    .optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().regex(/^(\+251|0)[0-9]{9}$/).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  specialty: z.string().max(255).nullable().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
