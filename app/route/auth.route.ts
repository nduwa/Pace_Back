import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controller/auth.controller";
import validate from "../middleware/validations/validator";
import {
  loginSchema,
  registerSchema,
} from "../middleware/validations/auth.schema";
import authorize from "../middleware/authorize.middleware";
import {
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../middleware/validations/auth.middleware";
import { IUserWithPermissions } from "../type/auth";

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

authRouter.post(
  "/reset-password-request",
  validate(resetPasswordRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthController.resetPasswordRequest(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthController.resetPassword(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

authRouter.put(
  "/update-password",
  authorize,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthController.updatePassword(
        req.body,
        req.user as IUserWithPermissions
      );
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return next(error);
    }
  }
);

export default authRouter;
