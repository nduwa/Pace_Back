import { z } from "zod";

export const examSchema = z.object({
  body: z.object({
    exam_code: z.string().min(1, "Drug code is required"),
    description: z.string().min(1, "Description is required"),
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0.1, "Invalid price"),
  }),
});
