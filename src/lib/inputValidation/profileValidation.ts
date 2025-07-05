import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    bio: z.string().max(200, { message: "Bio must be at most 200 characters" }),
    birthday: z
      .date()
      .optional()
      .refine((date) => {
        if (!date) return true; // If no date is provided, skip validation
        const parsedDate = new Date(date);
        return !Number.isNaN(parsedDate.getTime());
      }, { message: "Invalid date format" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(10, { message: "Phone number must be at most 10 digits" })
      .regex(/^\d+$/, { message: "Phone number must be a valid number" })
      .optional(),
    location: z.string().max(100, { message: "Location must be at most 100 characters" }).optional(),
    status: z.string().max(100, { message: "Status must be at most 100 characters" }).optional(),
    gender: z.enum(["male", "female", "other"]).optional()

  });

export type ProfileFormData = z.infer<typeof profileSchema>;