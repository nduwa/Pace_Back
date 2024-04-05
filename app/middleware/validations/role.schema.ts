import { z } from "zod";

export const roleSchema = z.object({
  body: z.object({
    label: z.string({
      required_error: "Role is required",
    }),
    permissions: z.array(z.string()).optional(),
  }),
});
