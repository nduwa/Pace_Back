import { NextFunction, Request, Response } from "express";
import UserModel from "../database/models/UserModel";
import { IUser, IUserWithPermissions } from "../type";
import { verifyToken } from "../utils/jwt";
import UserService from "../services/user.service";

declare global {
  namespace Express {
    interface Request {
      user?: IUserWithPermissions;
    }
  }
}

type IJwtPayload = Partial<{ id: string; email: string }>;

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization?.split(" ")[1]) {
      return res.status(401).json({ error: "Token not found" });
    }

    const tokenData = (await verifyToken(
      authorization?.split(" ")[1] as string
    )) as IJwtPayload;

    const user = await UserService.getUser({
      email: tokenData.email as string,
    });

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default authorize;
