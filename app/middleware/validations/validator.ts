import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req);
      return next();
    } catch (error) {
      const errorMap = error as ZodError;
      const validationErrors = errorMap.issues.map((issue) => {
        return { message: issue.message, field: issue.path };
      });
      return res.status(400).json(validationErrors);
    }
  };
export default validate;
