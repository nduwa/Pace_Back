import { z } from "zod";

export const createDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1, "Drug code is required"),
    description: z.string().min(1, "Designation is required"),
    designation: z.string().min(1, "Designation is required"),
    instruction: z.string(),
    sellingUnit: z.string().min(1, "Selling unit is required"),
    price: z.coerce.number().min(1, "Price is required"),
  }),
});

export const updateDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1, "Drug code is required"),
    description: z.string().min(1, "Designation is required"),
    designation: z.string().min(1, "Designation is required"),
    instruction: z.string(),
    sellingUnit: z.string().min(1, "Selling unit is required"),
    price: z.coerce.number().min(1, "Price is required"),
  }),
});

export const importDrug = z.object({
  body: z.object({
    drug_code: z.string(),
    description: z.string(),
    designation: z.string(),
    instruction: z.string(),
    sellingUnit: z.string(),
    price: z.coerce.number(),
  }),
});
