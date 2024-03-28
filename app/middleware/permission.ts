import { NextFunction, Request, Response } from "express";
import { Permission } from "../database/constants/permissions";
import CustomError from "../utils/CustomError";
import { UserPermission } from "../type";

export const allowedPermissions =
  (...persmissions: Permission[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const expectedPermissions: Permission[] = [
      "ALL_PERMISSIONS",
      ...persmissions,
    ];

    expectedPermissions.push("INSTITUTION_ADMIN");

    const userPersmission: Permission[] =
      (req?.user?.permissions.map(
        (persmission) => persmission.label
      ) as Permission[]) || [];

    const isArrowed = userPersmission.some((permission) =>
      expectedPermissions.includes(permission)
    );
    if (!isArrowed) {
      throw new CustomError("Access Denied", 403);
    }
    return next();
  };
