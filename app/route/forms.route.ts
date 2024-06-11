import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { FormController } from "../controller/forms.controller";
import {
  formInvoiceRequestSchema,
  formSchema,
} from "../middleware/validations/form.middleware";
import IsClinic from "../middleware/isClinic.middleware";
import { createInvoiceSchema } from "../middleware/validations/invoice.schema";
import isInstitution from "../middleware/isInstitution.middleware";

const formsRouter = express.Router();
formsRouter.use(authorize);

formsRouter.get(
  "/locations",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.getLocations(
        req.user?.institutionId as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/:id/give-drugs",
  validate(createInvoiceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.giveDrugs(
        req.body,
        req.user?.institutionId as string,
        req?.user?.id as unknown as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.use(IsClinic);

formsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { at, isOpen, page, limit, searchq } = req.query;
      const response = await FormController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        at as string,
        isOpen as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.get(
  "/by-location",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { at } = req.query;
      const response = await FormController.getAllByLocation(
        req.user?.institutionId as string | null,
        at as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/",
  validate(formSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.create(
        req.body,
        req.user?.institutionId as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
formsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/:id/send-form",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.sendForm(req.body, req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/:id/examination",
  isInstitution,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.examination(
        req.body,
        req.params.id,
        req.user?.id as string,
        req.user?.institutionId as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/:id/consultation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.consultation(
        req.body,
        req.params.id,
        req.user?.id as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.post(
  "/:id/save-invoice",
  validate(formInvoiceRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.saveInvoice(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

formsRouter.get(
  "/:id/make-invoice",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await FormController.possibleToBeInvoiced(
        req.params.id,
        req.user?.institutionId as string | null,
        req.user?.id as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default formsRouter;
