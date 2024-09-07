import CustomError, { catchSequelizeError } from "../utils/CustomError";
import readXlsxFile from "read-excel-file/node";
import { drugCategory } from "../middleware/validations/drug.schema";
import DrugModel from "../database/models/DrugModel";
import fs from "fs";
import DrugCategory from "../database/models/DrugCategory";
import {
  importDrug,
  importExam,
  importInsuranceDrug,
  importInsurancePrice,
} from "../middleware/validations/import.schema";
import ExamModel from "../database/models/ExamModel";
import InsuranceExams from "../database/models/InsuranceExams";
import InsuranceDrugs from "../database/models/InsuranceDrugs";
import InstitutionExams from "../database/models/InstututionExams";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import { Op } from "sequelize";

class ImportService {
  public static async importDrugs(
    file: Express.Multer.File,
    institutionId: string | null
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    console.log("importing here");

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();

      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      for (const row of rows) {
        total += 1;
        const data = {
          drug_code: this.nullToEmpty(row[1]),
          designation: this.nullToEmpty(row[2]),
          drugCategory: this.nullToEmpty(row[3]).toUpperCase(),
          description: "",
          instruction: "",
        };

        const validateData = importDrug.safeParse({ body: data });
        if (validateData.success && data.drug_code !== "DRUG_CODE") {
          try {
            const [r, created] = await DrugModel.findOrCreate({
              where: { drug_code: data.drug_code },
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

            if (created) {
              succeded += 1;
            } else {
              notInserted.push(`${row[1]}: Drug code already exists`);
            }
          } catch (e) {
            console.log("error:", data);
          }
        } else {
          notInserted.push(`${row[1]} : Validation error`);
        }
      }

      fs.unlinkSync(file.path);

      return {
        message: "Data imported successfully",
        failed: notInserted,
        succeded,
        total,
      };
    } catch (err: any) {
      catchSequelizeError({ item: "Drug", error: err });
    }
  }

  public static async importExams(file: Express.Multer.File): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();

      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      for (const row of rows) {
        total += 1;

        const data = {
          exam_code: this.nullToEmpty(row[1]),
          description: this.nullToEmpty(row[3]),
          name: this.nullToEmpty(row[2]),
          price: this.nullToEmpty(row[4]),
        };

        const validateData = importExam.safeParse({ body: data });
        if (validateData.success) {
          const [r, created] = await ExamModel.findOrCreate({
            where: { exam_code: data.exam_code },
            defaults: {
              ...data,
            },
            // transaction: transaction,
          });

          if (created) {
            succeded += 1;
          } else {
            notInserted.push(`${row[1]} : Exam code already exists`);
          }
        } else {
          notInserted.push(`${row[1]} : ${row[1]}`);
        }
      }

      fs.unlinkSync(file.path);

      return {
        message: "Data imported successfully",
        failed: notInserted,
        succeded,
        total,
      };
    } catch (err: any) {
      catchSequelizeError({ item: "Exam", error: err });
    }
  }

  public static async importInsurancePrice(
    file: Express.Multer.File,
    institutionId: string | null,
    type: string = "EXAM"
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    if (type != "EXAM") {
      return await this.importInsuranceDrugs(file);
    }

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();

      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      for (const row of rows) {
        total += 1;
        const data = {
          code: this.nullToEmpty(row[1]),
          name: this.nullToEmpty(row[2]),
          price: this.nullToEmpty(row[3]),
        };

        const validateData = importInsurancePrice.safeParse({ body: data });
        if (validateData.success) {
          let base =
            type == "EXAM"
              ? await ExamModel.findOne({ where: { exam_code: data.code } })
              : await DrugModel.findOne({ where: { drug_code: data.code } });
          if (base) {
            let [r, created] =
              type == "EXAM"
                ? await InsuranceExams.findOrCreate({
                    where: { examId: base.id, institutionId },
                    defaults: { examId: base.id, ...data, institutionId },
                  })
                : await InsuranceDrugs.findOrCreate({
                    where: { drugId: base.id, institutionId },
                    defaults: { examId: base.id, ...data, institutionId },
                  });

            if (!created) {
              r.update(
                {
                  ...data,
                },
                { where: { id: r.id } }
              );
            }

            succeded += 1;
          } else {
            notInserted.push(`${row[1]} : Not found`);
          }
        } else {
          notInserted.push(`${row[1]} : Validation error`);
        }
      }

      fs.unlinkSync(file.path);

      return {
        message: "Data imported successfully",
        failed: notInserted,
        succeded,
        total,
      };
    } catch (err: any) {
      catchSequelizeError({ item: "Import", error: err });
    }
  }

  public static async importInsuranceDrugs(
    file: Express.Multer.File
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();
      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      for (const row of rows) {
        total += 1;

        const data = {
          drug_code: this.nullToEmpty(row[2]),
          description: this.nullToEmpty(row[3]),
          designation: this.nullToEmpty(row[4]),
          instruction: this.nullToEmpty(row[5]).toUpperCase(),
          drugCategory: this.nullToEmpty(row[6]).toUpperCase(),
          price: this.nullToEmpty(row[7]).toUpperCase(),
        };

        const validateData = importInsuranceDrug.safeParse({ body: data });
        if (validateData.success) {
          const [user, created] = await InsuranceDrugs.findOrCreate({
            where: { drug_code: data.drug_code },
            defaults: {
              ...data,
            },
            // transaction: transaction,
          });

          DrugCategory.findOrCreate({
            where: { name: data.drugCategory },
            defaults: { name: data.drugCategory },
          });
          if (created) {
            succeded += 1;
          } else {
            notInserted.push(`${row[2]} : Drug code already exists`);
          }
        } else {
          // notInserted.push(`${row[2]} : Validation`);
        }
      }

      fs.unlinkSync(file.path);

      return { message: "Data imported successfully", failed: notInserted };
    } catch (err: any) {
      catchSequelizeError({ item: "Drug", error: err });
    }
  }

  public static async importInstitutionPrice(
    file: Express.Multer.File,
    institutionId: string | null,
    type: string = "EXAM"
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    try {
      const rows = await readXlsxFile(file.path);

      // Remove the header row
      rows.shift();

      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      for (const row of rows) {
        total += 1;
        const data = {
          code: this.nullToEmpty(row[1]),
          name: this.nullToEmpty(row[2]),
          price: this.nullToEmpty(row[3]),
        };

        const validateData = importInsurancePrice.safeParse({ body: data });
        if (validateData.success) {
          let base =
            type == "EXAM"
              ? await ExamModel.findOne({ where: { exam_code: data.code } })
              : await DrugModel.findOne({ where: { drug_code: data.code } });
          if (base) {
            if (type == "EXAM") {
              const [priceInDB, created] = await InstitutionExams.findOrCreate({
                where: {
                  examId: base.id,
                  institutionId,
                },
                defaults: { price: data.price, examId: base.id, institutionId },
              });

              if (!created) {
                await InstitutionExams.update(
                  { price: data.price },
                  { where: { id: priceInDB.id } }
                );
              }
            } else {
              await InstitutionDrugs.update(
                {
                  price: data.price,
                },
                {
                  where: {
                    quantity: { [Op.gt]: 0 },
                    institutionId,
                    drugId: base.id,
                  },
                }
              );
            }

            succeded += 1;
          } else {
            notInserted.push(`${row[1]} : Not found`);
          }
        } else {
          notInserted.push(`${row[1]} : Validation error`);
        }
      }

      fs.unlinkSync(file.path);

      return {
        message: "Data imported successfully",
        failed: notInserted,
        succeded,
        total,
      };
    } catch (err: any) {
      catchSequelizeError({ item: "Import", error: err });
    }
  }

  static nullToEmpty(value: any): string {
    return value == null ? "" : value.toString();
  }
}

export default ImportService;
