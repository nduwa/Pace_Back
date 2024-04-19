import CustomError, { catchSequelizeError } from "../utils/CustomError";
import readXlsxFile from "read-excel-file/node";
import {
  drugCategory,
  importDrug,
} from "../middleware/validations/drug.schema";
import DrugModel from "../database/models/DrugModel";
import fs from "fs";
import DrugCategory from "../database/models/DrugCategory";

class ImportService {
  public static async importDrugs(
    file: Express.Multer.File,
    institutionId: string | null
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();

      const notInserted: string[] = [];

      for (const row of rows) {
        const data = {
          drug_code: this.nullToEmpty(row[1]),
          description: this.nullToEmpty(row[2]),
          designation: this.nullToEmpty(row[3]),
          instruction: this.nullToEmpty(row[4]).toUpperCase(),
          drugCategory: this.nullToEmpty(row[5]).toUpperCase(),
        };

        const validateData = importDrug.safeParse({ body: data });
        if (validateData.success) {
          const [user, created] = await DrugModel.findOrCreate({
            where: { drug_code: data.drug_code, institutionId },
            defaults: {
              ...data,
              isOnMarket: true,
              institutionId,
            },
            // transaction: transaction,
          });

          DrugCategory.findOrCreate({
            where: { name: data.drugCategory },
            defaults: { name: data.drugCategory },
          });

          if (!created) {
            DrugModel.update(
              {
                ...data,
                isOnMarket: true,
                institutionId,
              },
              { where: { drug_code: data.drug_code, institutionId } }
            );
          }
        } else {
          notInserted.push(`${row[1]} : ${row[1]}`);
        }
      }

      fs.unlinkSync(file.path);

      return { message: "Data imported successfully", failed: notInserted };
    } catch (err: any) {
      catchSequelizeError({ drugStock: "Drug", error: err });
    }
  }

  static nullToEmpty(value: any): string {
    return value == null ? "" : value.toString();
  }
}

export default ImportService;
