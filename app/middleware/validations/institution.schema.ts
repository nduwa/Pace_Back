import { z } from "zod";

export const institutionSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    institutionType: z.string().optional(),
    hasPharmacy: z.boolean().optional(),
    admin: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      phone: z.string().min(10, "Invalid phone number"),
    }),
    details: z.object({
      location: z.string(),
      TIN: z.string(),
      percentage: z.coerce.number().optional(),
    }),
  }),
});

export const branchSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    details: z.object({
      location: z.string().min(1, "Location is required"),
      TIN: z.string().min(1, "Invalid TIN"),
    }),
  }),
});
