import CustomError, { catchSequelizeError } from "../../utils/CustomError";
import readXlsxFile from "read-excel-file/node";
import fs from "fs";
import sequelize, { Op, where } from "sequelize";
import {
  importServiceSchema,
  serviceActSchema,
} from "../../middleware/validations/service.schema";
import Service from "../../database/models/Services";
import ServiceAct from "../../database/models/ServiceAct";
import { IService } from "../../type/service";

class ServicesImportService {
  public static async importServicesAndActs(
    file: Express.Multer.File,
    institutionId: string | null,
    level: string = "GENERAL_CLINIC"
  ): Promise<any> {
    if (!file || !file.path) {
      throw new CustomError("Invalid file");
    }

    try {
      const rows = await readXlsxFile(file.path);
      console.log("importing");

      // Remove the header row
      rows.shift();

      let notInserted: string[] = [],
        succeded = 0,
        total = 0;

      let updatedActs: string[] = [],
        createdServices: IService[] = [];

      let service: IService | null = null;

      for (const row of rows) {
        total += 1;
        let data: { [key: string]: string } = {
          label: this.nullToEmpty(row[1]),
          price: this.nullToEmpty(row[2]),
          desc: this.nullToEmpty(row[3]).toUpperCase(),
          serviceId: service?.id || "",
        };

        const validateData = serviceActSchema.safeParse({ body: data });
        if (validateData.success) {
          try {
            const [r, created] = await ServiceAct.findOrCreate({
              where: { label: data.label },
              include: [
                {
                  model: Service,
                  as: "service",
                  where: { level },
                  required: true,
                },
              ],
              defaults: {
                ...data,
                institutionId,
              },
              // transaction: transaction,
            });

            updatedActs.push(r.id);

            if (created) {
              succeded += 1;
            } else {
              await r.update({ ...data }, { where: { id: r.id } });
            }
          } catch (e: any) {
            // console.log("error:", e.message);
          }
        } else {
          const serviceData = {
            label: this.nullToEmpty(row[0]),
            level,
            desc: data.desc,
          };

          const validateData = importServiceSchema.safeParse({
            body: serviceData,
          });

          if (validateData.success) {
            data.label = this.nullToEmpty(row[0]);
            console.log("service", data.label);

            const [created] = await Service.findOrCreate({
              where: { label: serviceData.label, level },
              defaults: {
                ...serviceData,

                assignDuringOrientation: ["LABORATORY", "LABORATOIRE"].includes(
                  data.label || ""
                ),
              },
            });
            createdServices.push(created.toJSON() as unknown as IService);
            service = created.toJSON();

            // const [r, created] = await Service.findOrCreate({
            //   where: { label: serviceData.label, level },

            //   defaults: {
            //     ...serviceData,

            //     assignDuringOrientation: ["LABORATORY", "LABORATOIRE"].includes(
            //       data.label || ""
            //     ),
            //   },
            // });

            // if (created) {
            //   createdServices.push(r.toJSON() as unknown as IService);
            // }

            // service = r.toJSON();
          } else {
            if (row[0] || row[1]) {
              notInserted.push(`${row[0] ?? row[1]}: Validation`);
            }
          }
        }
      }

      // Step 1: Find the relevant records
      const actsToUpdate = await ServiceAct.findAll({
        where: {
          institutionId: null,
          id: { [Op.notIn]: updatedActs },
        },
        include: [
          {
            model: Service,
            as: "service",
            where: { level },
            required: true,
          },
        ],
      });

      // Step 2: Update the records
      await ServiceAct.update(
        { price: 0 },
        {
          where: {
            id: actsToUpdate.map((act) => act.id),
          },
        }
      );

      let emptyServices: string[] = [];
      console.log(createdServices.length + " created");

      await Promise.all(
        createdServices.map(async (s, index) => {
          const countActs = await ServiceAct.count({
            where: { serviceId: s.id },
          });
          if (!countActs) {
            const hasDot = s.label.indexOf(".");

            const label = hasDot > -1 ? s.label.slice(hasDot + 1) : s.label;

            if (hasDot > -1 && hasDot < 5) {
              const nextCreatedServices = createdServices.slice(index + 1);
              const nextWithDot = nextCreatedServices.findIndex((ser) =>
                /^\d\./.test(ser.label)
              );

              const inBetween = nextCreatedServices.slice(0, nextWithDot);

              await Promise.all(
                inBetween.map(async (ser) => {
                  await Service.update(
                    { label: `${label}: ${ser.label}` },
                    { where: { id: ser.id } }
                  );
                })
              );
            }
            emptyServices.push(s.id);
            console.log(`${s.label} is empty`);
          }
        })
      );
      await Service.destroy({ where: { id: { [Op.in]: emptyServices } } });

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

  static nullToEmpty(value: any): string {
    return value == null ? "" : value.toString();
  }
}

export default ServicesImportService;
