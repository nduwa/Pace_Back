import { z } from "zod";

export const transactionSchema = z.object({
  body: z.object({
    type: z.string({
      required_error: "Type is required",
    }),
    amount: z.string({
      required_error: "Amount is required",
    }),
    reference: z.string({
      required_error: "Reference is required",
    }),
    reason: z.string({
      required_error: "Reason is required",
    }),
  }),
});
