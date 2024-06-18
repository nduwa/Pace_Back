import { NextFunction, Request, Response } from "express";

const IsClinic = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (
    user?.institution === null ||
    user?.institution.institutionType !== "CLINIC"
  ) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  return next();
};

export default IsClinic;
