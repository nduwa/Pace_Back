import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { serviceSchema } from "../middleware/validations/service.schema";
import { ServiceController } from "../controller/service.controller";

const serviceRouter = express.Router();
serviceRouter.use(authorize);

serviceRouter.get(
  "/",
  allowedPermissions("VIEW_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchq } = req.query;
      const response = await ServiceController.getAll(
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

serviceRouter.post(
  "/",
  allowedPermissions("UPDATE_SERVICES"),
  validate(serviceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
serviceRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceRouter.put(
  "/:id",
  allowedPermissions("UPDATE_SERVICES"),
  validate(serviceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceController.update(req.params.id, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceController.getNPaged(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceRouter.get(
  "/:id",
  allowedPermissions("VIEW_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default serviceRouter;
