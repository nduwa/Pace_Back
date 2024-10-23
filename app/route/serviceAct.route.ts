import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { serviceActSchema } from "../middleware/validations/service.schema";
import { ServiceActController } from "../controller/serviceAct.controller";
import isInstitution from "../middleware/isInstitution.middleware";
import { priceSchema } from "../middleware/validations/drug.schema";

const serviceActRouter = express.Router();
serviceActRouter.use(authorize);

serviceActRouter.get(
  "/",
  allowedPermissions("VIEW_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchq } = req.query;
      const response = await ServiceActController.getAll(
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

serviceActRouter.post(
  "/",
  allowedPermissions("UPDATE_SERVICES"),
  validate(serviceActSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
serviceActRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceActRouter.put(
  "/:id",
  allowedPermissions("UPDATE_SERVICES"),
  validate(serviceActSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceActRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.getNPaged(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceActRouter.get(
  "/:id",
  allowedPermissions("VIEW_SERVICES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

serviceActRouter.put(
  "/:id/prices",
  isInstitution,
  allowedPermissions("INSTITUTION_ADMIN"),
  validate(priceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ServiceActController.updatePrice(
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

export default serviceActRouter;
