import express, { NextFunction, Request, Response } from "express";
import validate from "../middleware/validations/validator";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import { UserController } from "../controller/user.controller";
import { createUserSchema } from "../middleware/validations/user.schema";
import UserRoles from "../database/models/UserRoles";

const userRouter = express.Router();

userRouter.use(authorize);

userRouter.get(
  "/",
  allowedPermissions("VIEW_USERS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;
      const { limit } = req.query;
      const { searchq } = req.query;

      const response = await UserController.getAllUsers(
        req.user?.institutionId as string | null,
        parseInt(page as string),
        limit as unknown as number,
        searchq as string
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

userRouter.get(
  "/:id",
  allowedPermissions("VIEW_USERS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.getUserWithPermissionsByPk(
        req.params.id
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

userRouter.post(
  "/",
  validate(createUserSchema),
  allowedPermissions("UPDATE_USERS"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.createUser(
        req.body,
        req.user?.institutionId as string | null
      );
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

userRouter.put(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.updateUserProfile(
        req?.user?.id as string,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  }
);

userRouter.post(
  "/:id/permissions",
  allowedPermissions("INSTITUTION_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.assignPermissions(
        req.params.id,
        req.body,
        req.user?.institutionId as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

export default userRouter;
