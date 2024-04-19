import { z } from "zod";

export const createDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1, "Drug code is required"),
    description: z.string().min(1, "Designation is required"),
    designation: z.string().min(1, "Designation is required"),
    instruction: z.string(),
    drugCategory: z.string().min(1, "Selling unit is required"),
  }),
});

export const updateDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1, "Drug code is required"),
    description: z.string().min(1, "Designation is required"),
    designation: z.string().min(1, "Designation is required"),
    instruction: z.string(),
    drugCategory: z.string().min(1, "Selling unit is required"),
  }),
});

export const importDrug = z.object({
  body: z.object({
    drug_code: z.string(),
    description: z.string(),
    designation: z.string(),
    instruction: z.string(),
    drugCategory: z.string(),
  }),
});

export const drugStockSchema = z.object({
  body: z.object({
    drugId: z.string().uuid("Invalid drug ID"),
    quantity: z.number().min(0, "Quantity is required"),
    price: z.number().min(0, "Price is required"),
    batchNumber: z.string().max(255, "Batch number is too long"),
    expireDate: z.coerce.date(),
  }),
});

export const drugCategory = z.object({
  body: z.object({
    name: z.string().min(1, "Drug code is required"),
  }),
});

export type IDrugStockInput = z.infer<typeof drugStockSchema>;
