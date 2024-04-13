import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { DrugController } from "../controller/drug.controller";
import { createDrug, updateDrug } from "../middleware/validations/drug.schema";

const drugsRouter = express.Router();
drugsRouter.use(authorize);

drugsRouter.get(
  "/",
  allowedPermissions("INSTITUTION_ADMIN", "VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sellingUnit, isOnMarket, page, limit, searchq } = req.query;
      console.log(searchq);
      const response = await DrugController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        searchq as string,
        isOnMarket as string,
        sellingUnit as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.post(
  "/",
  allowedPermissions("UPDATE_MEDECINES"),
  validate(createDrug),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.create(
        req.body,
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
drugsRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.put(
  "/:id",
  allowedPermissions("UPDATE_MEDECINES"),
  validate(updateDrug),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.update(req.params.id, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.put(
  "/all",
  allowedPermissions("VIEW_MEDECINES"),
  validate(updateDrug),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.all(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/categories",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("THERE");
      const response = await DrugController.categories();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/:id",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default drugsRouter;
