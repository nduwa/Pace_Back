import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import rolesRouter from "./role.route";
import institutionRouter from "./institution.route";
import drugsRouter from "./drug.route";
import importRouter from "./import.route";
import purchaseRouter from "./purchase.routes";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/institutions", institutionRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/drugs", drugsRouter);
apiRouter.use("/import", importRouter);
apiRouter.use("/purchases", purchaseRouter);

export default apiRouter;
