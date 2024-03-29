import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const resetPasswordRequestSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({
      required_error: "Token is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  }),
});
