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
}
