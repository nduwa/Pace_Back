import { z } from "zod";

export const consultationSchema = z.object({
  body: z.object({
    services: z.array(
      z.object({
        serviceId: z.string(),
        id: z.string().optional(),
      })
    ),
  }),
});
