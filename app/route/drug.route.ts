import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { DrugController } from "../controller/drug.controller";
import {
  createDrug,
  priceSchema,
  updateDrug,
} from "../middleware/validations/drug.schema";
import isInstitution from "../middleware/isInstitution.middleware";

const drugsRouter = express.Router();
drugsRouter.use(authorize);

drugsRouter.get(
  "/",
  allowedPermissions("INSTITUTION_ADMIN", "VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { drugCategory, isOnMarket, page, limit, searchq } = req.query;
      const response = await DrugController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        searchq as string,
        isOnMarket as string,
        drugCategory as string,
        "drugs"
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/insurance-prices",
  allowedPermissions("INSTITUTION_ADMIN", "VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { drugCategory, isOnMarket, page, limit, searchq } = req.query;
      const response = await DrugController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        searchq as string,
        isOnMarket as string,
        drugCategory as string,
        "insurance-price"
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/institution",
  allowedPermissions("INSTITUTION_ADMIN", "VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, listType, drug } = req.query;
      const response = await DrugController.getInstitutionDrugs(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        listType as string,
        drug as string
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

drugsRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.all(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/insurance-prices/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.insuranceDrugsAll();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/no-insurance/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.noInsuranceAll();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.post(
  "/insurance-prices/matching",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.insurancePriceMatching(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.put(
  "/:id/prices",
  isInstitution,
  allowedPermissions("UPDATE_MEDECINES"),
  validate(priceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.updatePrice(
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

drugsRouter.put(
  "/:id/insurance-prices",
  isInstitution,
  allowedPermissions("INSURANCE_PRICES"),
  validate(priceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.updateInsurancePrice(
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

drugsRouter.get(
  "/institution/all",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.institutionAll(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

drugsRouter.get(
  "/institution/grouped",
  allowedPermissions("VIEW_MEDECINES"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DrugController.institutionGrouped(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default drugsRouter;
