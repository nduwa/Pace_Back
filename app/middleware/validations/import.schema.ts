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
    drug_code: z.string(),
    description: z.string(),
    designation: z.string(),
    instruction: z.string(),
    drugCategory: z.string(),
  }),
});

export const importInsurancePrice = z.object({
  body: z.object({
    code: z.string(),
    price: z.coerce.number(),
  }),
});
