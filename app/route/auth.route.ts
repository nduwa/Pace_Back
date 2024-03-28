import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controller/auth.controller";
import validate from "../middleware/validations/validator";
import {
  loginSchema,
  registerSchema,
} from "../middleware/validations/auth.schema";
import authorize from "../middleware/authorize.middleware";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res, next: NextFunction) => {
    try {
      const response = await AuthController.register(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

authRouter.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res, next: NextFunction) => {
    try {
      const response = await AuthController.login(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

authRouter.get(
  "/",
  authorize,
  async (req: Request, res, next: NextFunction) => {
    try {
      const response = await AuthController.me(req.user?.id as string);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default authRouter;
