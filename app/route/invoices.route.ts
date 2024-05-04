import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { InvoiceController } from "../controller/invoices.controller";
import { createInvoiceSchema } from "../middleware/validations/invoice.schema";

const invoicesRouter = express.Router();
invoicesRouter.use(authorize);

invoicesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, requester, page, limit, searchq } = req.query;
      const response = await InvoiceController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        startDate as string,
        endDate as string,
        requester as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

invoicesRouter.post(
  "/",
  validate(createInvoiceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InvoiceController.create(
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
invoicesRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InvoiceController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

invoicesRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await InvoiceController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default invoicesRouter;
