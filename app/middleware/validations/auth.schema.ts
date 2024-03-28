import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email required").email("Not a valid email"),
    password: z.string().min(1, "Password number required"),
    phone: z.string().min(1, "Phone number required").max(12, "Phone too long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email required").email("Not a valid email"),
    password: z.string().min(1, "Password number required"),
  }),
});
