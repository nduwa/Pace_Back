import express from "express";
import authRouter from "./auth.route";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

export default apiRouter;
