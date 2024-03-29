import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
