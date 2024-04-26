import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import validate from "../middleware/validations/validator";
import {
  createPurchaseSchema,
  purchaseDrugsSchema,
} from "../middleware/validations/purchase.schema";
import { PurchaseController } from "../controller/purchases.controller";
import { allowedPermissions } from "../middleware/permission";
import isInstitution from "../middleware/isInstitution.middleware";

const purchaseRouter = express.Router();

purchaseRouter.use(authorize);
purchaseRouter.use(isInstitution);

purchaseRouter.post(
  "/",
  validate(createPurchaseSchema),
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PurchaseController.addPurchase(
        req.user?.institutionId as string,
        req.body
      );
      return res.status(201).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

purchaseRouter.get(
  "/",
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;
      const { limit } = req.query;
      const { searchq } = req.query;

      const response = await PurchaseController.getAllPurchases(
        req.user?.institutionId as string,
        page as unknown as number,
        limit as unknown as number,
        searchq as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

purchaseRouter.get(
  "/drugs-purchases",
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;
      const { limit } = req.query;
      const response = await PurchaseController.getDrugPurchaseHistory(
        req.user?.institutionId as string,
        page as unknown as number,
        limit as unknown as number
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

purchaseRouter.get(
  "/:id",
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await PurchaseController.getOne(id as string);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

purchaseRouter.get(
  "/drugs-purchases/:id",
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const response = await PurchaseController.getDrugsByPurchase(id);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

purchaseRouter.post(
  "/drugs-purchases",
  validate(purchaseDrugsSchema),
  allowedPermissions("PURCHASE_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await PurchaseController.drugsAdjust(req.body);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

export default purchaseRouter;
