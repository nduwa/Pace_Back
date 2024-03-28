import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import VARIABLES from "./config/variables";
import apiRouter from "./route/api.routes";
import db from "./config/db.config";
import CustomError from "./utils/CustomError";
import loadInitialData from "./utils/LoadInitials";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(
  cors({
    credentials: true,
  })
);

app.use("/api", apiRouter);

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.log(err.message);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Something went wrong" });
  }
});
const server = http.createServer(app);

db.authenticate().then(async () => {
  server.listen(VARIABLES.PORT, () => {
    console.log(`runnning on http://localhost:${VARIABLES.PORT}`);
  });
  try {
    await loadInitialData(db);
    console.log("DATABASE SYNC COMPLETED ");
  } catch (error) {
    console.log("DATABASE SYNC FAILED ");
  }
});
