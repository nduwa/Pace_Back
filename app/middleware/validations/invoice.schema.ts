import { z } from "zod";

export const createInvoiceSchema = z.object({
  body: z.object({
    note: z.string().optional(),
    patientId: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    drugs: z
      .array(
        z.object({
          drug: z
            .string({ required_error: "select Drug" })
            .min(4, { message: "invalid Drug" }),
          qty: z.number({ invalid_type_error: "Quantity must be a number" }),
        })
      )
      .min(1),
  }),
});
