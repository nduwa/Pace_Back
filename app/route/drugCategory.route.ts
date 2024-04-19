import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { DrugCategoryController } from "../controller/drugCategory.controller";
import { drugCategorySchema } from "../middleware/validations/purchase.schema";

const drugsCategoryRouter = express.Router();
drugsCategoryRouter.use(authorize);

drugsCategoryRouter.get(
  "/",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchq } = req.query;
      const response = await DrugCategoryController.getAll(
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

drugsCategoryRouter.post(
  "/",
  allowedPermissions("UPDATE_MEDECINES"),
  validate(drugCategorySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugCategoryController.create(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
drugsCategoryRouter.delete(
  "/:id",
  allowedPermissions("UPDATE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugCategoryController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsCategoryRouter.put(
  "/:id",
  allowedPermissions("UPDATE_MEDECINES"),
  validate(drugCategorySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugCategoryController.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsCategoryRouter.get(
  "/all",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugCategoryController.getNPaged();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsCategoryRouter.get(
  "/:id",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugCategoryController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default drugsCategoryRouter;
