import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { ConsultationController } from "../controller/consultation.controller";
import { consultationSchema } from "../middleware/validations/consultation.schema";
import isInstitution from "../middleware/isInstitution.middleware";

const consultationsRouter = express.Router();
consultationsRouter.use(authorize);
consultationsRouter.use(isInstitution);

consultationsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page, limit, searchq } = req.query;
      const response = await ConsultationController.getAll(
        req.user?.institutionId as string | null,
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

consultationsRouter.post(
  "/",
  allowedPermissions("INSTITUTION_ADMIN"),
  validate(consultationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ConsultationController.create(
        req.body,
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
consultationsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ConsultationController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

consultationsRouter.put(
  "/:id",
  allowedPermissions("INSTITUTION_ADMIN"),
  validate(consultationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ConsultationController.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

consultationsRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ConsultationController.all(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

consultationsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ConsultationController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default consultationsRouter;
