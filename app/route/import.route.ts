import express, { NextFunction, Request, Response } from "express";
import { allowedPermissions } from "../middleware/permission";
import authorize from "../middleware/authorize.middleware";
import { ImportController } from "../controller/import.controller";
import { uploadExcel } from "../utils/Multer";

const importRouter = express.Router();

importRouter.use(authorize);
importRouter.post(
  "/drugs",
  allowedPermissions("IMPORT_MEDECINES"),
  uploadExcel.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(422).send({ message: "No file uploaded" });
        return;
      }

      console.log(file);
      const response = await ImportController.uploadFile(
        file,
        req.user?.institutionId as string | null
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
export default importRouter;
