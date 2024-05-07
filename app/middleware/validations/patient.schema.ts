import { z } from "zod";

export const patientSchema = z.object({
  body: z.object({
    NID: z.string().min(16, "NID is required"),
    gender: z.string().min(1, "Gender is required"),
    birthDate: z.string().min(1, "Invalid date"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.object({
      province: z.string(),
      district: z.string(),
      sector: z.string(),
      cell: z.string(),
      village: z.string(),
    }),
  }),
});
