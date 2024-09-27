import { z } from "zod";

export const serviceSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Service label required"),
    level: z.string().min(1, "Service level required"),
    desc: z.string().optional(),
    assignDuringOrientation: z.boolean().optional(),
  }),
});

export const serviceActSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1, "Service required"),
    label: z.string().min(1, "Act label required"),
    desc: z.string().optional(),
    price: z.coerce.number(),
  }),
});

export const importServiceSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Service label required"),
  }),
});
