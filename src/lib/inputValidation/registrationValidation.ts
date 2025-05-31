import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    password: z.string().min(6, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Error path for confirmPassword field
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
