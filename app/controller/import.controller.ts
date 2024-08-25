import {
  Route,
  Controller,
  Post,
  Tags,
  Inject,
  Security,
  UploadedFile,
  Response,
} from "tsoa";
import CustomError from "../utils/CustomError";
import ImportService from "../services/import.service";

@Tags("Import")
@Security("jwtAuth")
@Route("api/import")
export class ImportController extends Controller {
  @Post("drugs")
  @Response(200, "Drugs imported successfully")
  public static async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Inject() institutionId: string | null
  ): Promise<any> {
    try {
      const result = await ImportService.importDrugs(file, institutionId);
      return result;
    } catch (err: any) {
      throw new CustomError("Error during file upload", err);
    }
  }

  @Post("exams")
  @Response(200, "Exams imported successfully")
  public static async importExams(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    try {
      const result = await ImportService.importExams(file);
      return result;
    } catch (err: any) {
      throw new CustomError("Error during file upload", err);
    }
  }

  @Post("insurance-prices/{type}")
  @Response(200, "Insurance prices imported successfully")
  public static async importInsurancePrices(
    @UploadedFile() file: Express.Multer.File,
    @Inject() institutionId: string,
    @Inject() type: string
  ): Promise<any> {
    try {
      const result = await ImportService.importInsurancePrice(
        file,
        institutionId,
        type
      );
      return result;
    } catch (err: any) {
      throw new CustomError("Error during file upload", err);
    }
  }

  @Post("institution-prices/{type}")
  @Response(200, "Institution prices imported successfully")
  public static async importInstitutionPrice(
    @UploadedFile() file: Express.Multer.File,
    @Inject() institutionId: string,
    @Inject() type: string
  ): Promise<any> {
    try {
      const result = await ImportService.importInstitutionPrice(
        file,
        institutionId,
        type
      );
      return result;
    } catch (err: any) {
      throw new CustomError("Error during file upload", err);
    }
  }
}
