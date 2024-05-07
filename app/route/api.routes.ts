import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import rolesRouter from "./role.route";
import institutionRouter from "./institution.route";
import drugsRouter from "./drug.route";
import importRouter from "./import.route";
import purchaseRouter from "./purchase.routes";
import drugsCategoryRouter from "./drugCategory.route";
import transactionsRouter from "./transaction.route";
import patientsRouter from "./patient.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/institutions", institutionRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/drugs", drugsRouter);
apiRouter.use("/import", importRouter);
apiRouter.use("/purchases", purchaseRouter);
apiRouter.use("/drug-categories", drugsCategoryRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/patients", patientsRouter);

export default apiRouter;
