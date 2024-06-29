import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { examSchema } from "../middleware/validations/exam.schems";
import { ExamController } from "../controller/exams.controller";
import isInstitution from "../middleware/isInstitution.middleware";
import { priceSchema } from "../middleware/validations/drug.schema";

const examRouter = express.Router();
examRouter.use(authorize);

examRouter.get(
  "/",
  allowedPermissions("VIEW_EXAMS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchq } = req.query;
      const response = await ExamController.getAll(
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

examRouter.post(
  "/",
  allowedPermissions("UPDATE_EXAMS"),
  validate(examSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
examRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_EXAMS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

examRouter.put(
  "/:id",
  allowedPermissions("UPDATE_EXAMS"),
  validate(examSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.update(req.params.id, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

examRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.getNPaged(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

examRouter.get(
  "/:id",
  allowedPermissions("VIEW_EXAMS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

examRouter.put(
  "/:id/prices",
  isInstitution,
  allowedPermissions("INSTITUTION_ADMIN"),
  validate(priceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ExamController.updatePrice(
        req.body,
        req.user?.institutionId as string,
        req.params.id
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default examRouter;
