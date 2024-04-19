import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { TransactionController } from "../controller/transaction.controller";
import { transactionSchema } from "../middleware/validations/transaction.schema";

const transactionsRouter = express.Router();
transactionsRouter.use(authorize);

transactionsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page, limit, searchq } = req.query;
      const response = await TransactionController.getAll(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        searchq as string,
        type as string
      );

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

transactionsRouter.post(
  "/",
  validate(transactionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await TransactionController.create(
        req.body,
        req.user?.institutionId as string | null,
        req?.user?.id as unknown as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
transactionsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await TransactionController.delete(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

transactionsRouter.put(
  "/:id",
  validate(transactionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await TransactionController.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

transactionsRouter.get(
  "/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await TransactionController.all(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

transactionsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await TransactionController.getOne(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default transactionsRouter;
