import CustomError, { catchSequelizeError } from "../utils/CustomError";
import readXlsxFile from "read-excel-file/node";
import { importDrug } from "../middleware/validations/drug.schema";
import DrugModel from "../database/models/DrugModel";
import fs from "fs";

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
        console.log(row[6]);
        const data = {
          drug_code: this.nullToEmpty(row[1]),
          description: this.nullToEmpty(row[2]),
          designation: this.nullToEmpty(row[3]),
          instruction: this.nullToEmpty(row[4]).toUpperCase(),
          sellingUnit: this.nullToEmpty(row[5]).toUpperCase(),
          price: Math.ceil(parseInt(this.nullToEmpty(row[6]))).toFixed(2),
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
