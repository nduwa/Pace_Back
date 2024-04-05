import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import rolesRouter from "./role.route";
import institutionRouter from "./institution.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/institutions", institutionRouter);
apiRouter.use("/roles", rolesRouter);

export default apiRouter;
