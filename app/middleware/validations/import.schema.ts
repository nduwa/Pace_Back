import { z } from "zod";

export const importExam = z.object({
  body: z.object({
    exam_code: z.string(),
    description: z.string(),
    name: z.string(),
    price: z.coerce.number(),
  }),
});

export const importDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1, "Required"),
    designation: z.string().min(1),
    drugCategory: z.string().min(1),
  }),
});

export const importInsuranceDrug = z.object({
  body: z.object({
    drug_code: z.string().min(1),
    description: z.string(),
    designation: z.string().min(1),
    instruction: z.string(),
    drugCategory: z.string(),
    price: z.coerce.number(),
  }),
});

export const importInsurancePrice = z.object({
  body: z.object({
    code: z.string(),
    price: z.coerce.number(),
  }),
});
