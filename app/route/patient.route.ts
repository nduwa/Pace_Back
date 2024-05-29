import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { PatientController } from "../controller/patient.controller";
import { patientSchema } from "../middleware/validations/patient.schema";
import { InvoiceController } from "../controller/invoices.controller";
import { string } from "zod";

const patientsRouter = express.Router();
patientsRouter.use(authorize);

patientsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page, limit, searchq } = req.query;
      const response = await PatientController.getAll(
        parseInt(page as string),
        limit as unknown as number,
        searchq as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.post(
  "/",
  validate(patientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PatientController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
patientsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PatientController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.put(
  "/:id",
  validate(patientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PatientController.update(req.params.id, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.post(
  "/:id/dependents",
  validate(patientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PatientController.addDependent(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchq } = req.query;
      const response = await PatientController.all(searchq as string);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PatientController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

patientsRouter.get(
  "/:id/invoices",

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, type, institution, page, limit, searchq } =
        req.query;
      const response = await PatientController.patientsInvoices(
        req.params.id as string,
        parseInt(page as string),
        limit as unknown as number,
        startDate as string,
        endDate as string,
        type as string,
        institution as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default patientsRouter;
