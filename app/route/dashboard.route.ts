import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { DashboardController } from "../controller/dashboard.controller";

const dashboardRouter = express.Router();
dashboardRouter.use(authorize);
dashboardRouter.get(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await DashboardController.index(
        req.user?.institutionId as string,
        req.user?.id || ""
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

dashboardRouter.get(
  "/transactions",
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    try {
      const response = await DashboardController.transactions(
        startDate as string,
        endDate as string,
        req.user?.institutionId as string
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default dashboardRouter;
