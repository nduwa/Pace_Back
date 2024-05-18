import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { InstitutionController } from "../controller/institution.controller";
import {
  branchSchema,
  institutionSchema,
} from "../middleware/validations/institution.schema";
import isInstitution from "../middleware/isInstitution.middleware";

const institutionRouter = express.Router();
institutionRouter.use(authorize);

institutionRouter.post(
  "/",
  allowedPermissions("UPDATE_INSTITUTIONS"),
  validate(institutionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
institutionRouter.post(
  "/branches",
  isInstitution,
  allowedPermissions("INSTITUTION_ADMIN"),
  validate(branchSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.createBranches(
        req.body,
        req.user?.id as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
institutionRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_INSTITUTIONS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
institutionRouter.put(
  "/:id",
  allowedPermissions("UPDATE_INSTITUTIONS"),
  validate(institutionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
institutionRouter.get(
  "/",
  allowedPermissions("VIEW_INSTITUTIONS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;
      const { limit } = req.query;
      const { searchq } = req.query;
      const { type } = req.query;

      const response = await InstitutionController.getAll(
        parseInt(page as string),
        limit as unknown as number,
        searchq as string,
        type as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

institutionRouter.get(
  "/pharmacies",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.getPharmacies();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

institutionRouter.get(
  "/insurances",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.getInsurances();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

institutionRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InstitutionController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
export default institutionRouter;
