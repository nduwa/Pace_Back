import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError";

const isInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (user?.institutionId === null) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  return next();
};

export default isInstitution;
