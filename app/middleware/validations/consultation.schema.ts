import { z } from "zod";

export const consultationSchema = z.object({
  body: z.object({
    label: z
      .string({
        required_error: "Type is required",
      })
      .min(1),
    price: z
      .number({
        required_error: "Amount is required",
      })
      .min(0.1),
  }),
});
