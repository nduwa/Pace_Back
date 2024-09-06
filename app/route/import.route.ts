import express, { NextFunction, Request, Response } from "express";
import { allowedPermissions } from "../middleware/permission";
import authorize from "../middleware/authorize.middleware";
import { ImportController } from "../controller/import.controller";
import { uploadExcel } from "../utils/Multer";
import isInstitution from "../middleware/isInstitution.middleware";

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

importRouter.post(
  "/exams",
  allowedPermissions("IMPORT_EXAMS"),
  uploadExcel.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(422).send({ message: "No file uploaded" });
        return;
      }

      const response = await ImportController.importExams(file);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

importRouter.post(
  "/insurance-prices/:type",
  allowedPermissions("INSURANCE_PRICES"),
  uploadExcel.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(422).send({ message: "No file uploaded" });
        return;
      }

      const response = await ImportController.importInsurancePrices(
        file,
        req.user?.institutionId as string,
        req.params?.type as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

importRouter.post(
  "/institution-prices/:type",
  allowedPermissions("INSTITUTION_ADMIN"),
  uploadExcel.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(422).send({ message: "No file uploaded" });
        return;
      }

      const response = await ImportController.importInstitutionPrice(
        file,
        req.user?.institutionId as string,
        req.params?.type as string
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);
export default importRouter;
