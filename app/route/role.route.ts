import express, { NextFunction, Request, Response } from "express";
import authorize from "../middleware/authorize.middleware";
import { allowedPermissions } from "../middleware/permission";
import validate from "../middleware/validations/validator";
import { roleSchema } from "../middleware/validations/role.schema";
import { RolesController } from "../controller/role.controller";

const rolesRouter = express.Router();
rolesRouter.use(authorize);
rolesRouter.post(
  "/",
  allowedPermissions("ALL_PERMISSIONS", "INSTITUTION_ADMIN"),
  validate(roleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.createRole(
        req.body,
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.delete(
  "/:id",
  allowedPermissions("ALL_PERMISSIONS", "INSTITUTION_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.deleteRole(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.put(
  "/:id",
  allowedPermissions("ALL_PERMISSIONS", "INSTITUTION_ADMIN"),
  validate(roleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.updateRole(
        req.body,
        req.params.id
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.getAllRoles(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.get(
  "/app/permissions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.getPermissions(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.get(
  "/permissions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user?.institutionId as string | null;
      const response = await RolesController.getPermissionsWithGroup(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.get(
  "/list",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.getRolesList(
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
rolesRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await RolesController.getRole(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
export default rolesRouter;
