import { Op } from "sequelize";
import InvoiceDrugsModel from "../database/models/InvoiceDrugsModel";
import InvoiceModel from "../database/models/InvoiceModel";
import {
  ICreateInvoiceDTO,
  IInstitutionDrug,
  IInvoiceDTO,
} from "../type/drugs";
import CustomError, { catchSequelizeError } from "../utils/CustomError";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import UserModel from "../database/models/UserModel";
import { Paged } from "../type";
import { DatesOpt, TimestampsNOrder } from "../utils/DBHelpers";
import InstitutionModel from "../database/models/Institution";
import DrugService from "./drug.service";
import InvoiceExams from "../database/models/InvoiceExams";
import InvoiceConsultations from "../database/models/InvoiceConsultations";
import FormDrugs from "../database/models/FormDrugs";
import { IFormDrugDTO } from "../type/form";
import FormModel from "../database/models/FormModel";
import db from "../config/db.config";

class InvoiceService {
  public static async create(
    data: ICreateInvoiceDTO,
    userId: string,
    institutionId: string,
    autoGive: boolean = true
  ): Promise<IInvoiceDTO> {
    return db.transaction(async (t) => {
      const patientId =
        data.patientId && data.patientId.length > 0
          ? data.patientId
          : undefined;
      const insuranceUse = data.insuranceId && data.insuranceId.length > 0;

      let createdInvoice: InvoiceModel;
      if (data.formId) {
        const [inv] = await InvoiceModel.findOrCreate({
          where: { formId: data.formId, institutionId, published: false },
          defaults: {
            ...data,
            drugs: undefined,
            institutionId,
            insuranceId: insuranceUse ? data.insuranceId : null,
            insuranceCard: insuranceUse ? data.insuranceCard : null,
            formId: data.formId,
            patientId,
            name: data.name,
            userId,
            phone: data.phone,
            type: "CLINICAL_RECORD",
            published: false,
            totalCost: 0,
          },
          transaction: t,
        });
        createdInvoice = inv;
      } else {
        createdInvoice = await InvoiceModel.create(
          {
            ...data,
            drugs: undefined,
            patientId,
            userId: userId,
            institutionId,
            insuranceId: insuranceUse ? data.insuranceId : null,
            insuranceCard: insuranceUse ? data.insuranceCard : null,
            published: true,
            totalCost: 0,
          },
          {
            transaction: t,
          }
        );
      }

      const requestedDrugsIds = data.drugs.map((drug) => drug.drug);

      const requestedDrugs = await InstitutionDrugs.findAll({
        where: { id: { [Op.in]: requestedDrugsIds } },
        include: ["drug", "insuranceDrug"],
      });

      //   check quantity

      let error: string | undefined = undefined;

      await Promise.all(
        data.drugs.map(async (drug, index) => {
          const drugJSON: IInstitutionDrug = requestedDrugs.find(
            (d) => d.id == drug.drug
          ) as unknown as IInstitutionDrug;

          if (drug.qty > drugJSON.quantity) {
            error = `${drugJSON?.drug?.designation} has insuficcient quantity`;
          }
        })
      );

      if (error) {
        throw new CustomError(error, 400);
      }
      console.log("quntity checked");
      // Check prescription
      if (data.formId) {
        const prescribedDrugs = await FormDrugs.findAll({
          where: { formId: data.formId },
          include: ["drug"],
        });

        await Promise.all(
          data.drugs.map(async (drug, index) => {
            const InstitutionDrugJSON: IInstitutionDrug = requestedDrugs.find(
              (d) => d.id == drug.drug
            ) as unknown as IInstitutionDrug;

            const drugJSON = prescribedDrugs.find(
              (d) => d.drugId == InstitutionDrugJSON.drugId
            ) as unknown as IFormDrugDTO;

            const requiredQuantity =
              drugJSON.quantity - drugJSON.givenQuantitty;

            if (drug.qty > requiredQuantity) {
              error = `${drugJSON?.drug?.designation} requires only ${requiredQuantity}`;
            }
          })
        );

        if (error) {
          throw new CustomError(error, 400);
        }
      }

      let totalCost = 0,
        totalPatientCost = 0,
        totalInsuranceCost = 0;
      if (requestedDrugs.length !== data.drugs.length)
        throw new CustomError("Something went wrong");

      await Promise.all(
        data.drugs.map(async (drug, index) => {
          let quantityRemaining = drug.qty,
            quantityGiven = 0;
          const batchNumber = requestedDrugs[index].batchNumber,
            drugId = requestedDrugs[index].drugId;
          while (quantityRemaining > 0) {
            const itemtogive = await InstitutionDrugs.findOne({
              where: {
                quantity: { [Op.gt]: 0 },
                isAvailable: true,
                institutionId,
                drugId,
                batchNumber,
              },
              transaction: t,
            });

            const hasQuantity = itemtogive?.quantity || 0;
            const availableToGive = Math.min(
              hasQuantity,
              Math.max(quantityRemaining, 0)
            );
            const remaining = hasQuantity - availableToGive;

            if (availableToGive)
              await InstitutionDrugs.update(
                {
                  quantity: remaining,
                  isAvailble: remaining > 0,
                },
                {
                  where: { id: itemtogive?.id },
                  transaction: t,
                }
              );

            quantityRemaining -= availableToGive;
            quantityGiven += availableToGive;
          }

          if (quantityGiven) {
            const hasInsuranceCost =
                requestedDrugs[index]?.insuranceDrug !== null,
              selectedDrug = requestedDrugs[index];

            const unitPrice =
              (insuranceUse && hasInsuranceCost
                ? selectedDrug?.insuranceDrug?.price
                : selectedDrug?.price) || 0;
            const quantity = drug.qty;
            const cost = unitPrice * quantity;
            const insuranceCost =
              insuranceUse && hasInsuranceCost
                ? (unitPrice * 85) / 100 || 0
                : 0;
            const insuranceTotalCost = parseFloat(
              (insuranceCost * quantity).toFixed(2)
            );
            const patientTotalCost = parseFloat(
              (cost - insuranceTotalCost).toFixed(2)
            );

            await InvoiceDrugsModel.create(
              {
                institutionId,
                drugId,
                patientId,
                quantity: quantityGiven,
                unitPrice: requestedDrugs[index].price,
                insuranceDrugId: requestedDrugs[index].insuranceDrugId,
                totalPrice: cost,
                patientCost: patientTotalCost,
                insuranceCost: insuranceTotalCost,
                invoiceId: createdInvoice.id,
                institutionDrugId: requestedDrugs[index].id,
                isGiven: createdInvoice.published ? true : null,
              },
              {
                transaction: t,
              }
            );

            totalCost += cost;
            totalPatientCost += patientTotalCost;
            totalInsuranceCost += insuranceTotalCost;
          }
        })
      );

      await InvoiceModel.update(
        {
          totalCost: totalCost,
          patientCost: totalPatientCost,
          insuranceCost: totalInsuranceCost,
        },
        {
          where: { id: createdInvoice.id },
          transaction: t,
        }
      );

      const Invoice = (await InvoiceModel.findByPk(createdInvoice.id, {
        include: this.includeStatement,
        transaction: t,
      })) as unknown as IInvoiceDTO;

      return Invoice;
    });
  }

  public static async giveDrug(drugId: string) {
    const drug = await InvoiceDrugsModel.findByPk(drugId, {
      include: ["invoice", "institution"],
    });
    if (!drug) throw new CustomError("Not found");
    if (drug.invoice.published !== true)
      throw new CustomError("Invoice not yet paid!");
    if (drug.isGiven) throw new CustomError("Already given");

    // check quantity
    const drugInStock = await InstitutionDrugs.findByPk(drug.institutionDrugId);
    if (!drugInStock) throw new CustomError("Drug not found");
    if (drugInStock.quantity < drug.quantity)
      throw new CustomError("Insufficient quantity in stock");
    else {
      drug.update({ isGiven: true });
      const form = await FormModel.findByPk(drug.invoice.formId);
      if (form) {
        const d = await FormDrugs.findOne({
          where: { formId: form.id, drugId: drug?.drugId },
        });
        await d?.increment("givenQuantity", { by: drug.quantity });
      }
    }

    return true;
  }

  public static async removeDrug(drugId: string) {
    const drug = await InvoiceDrugsModel.findByPk(drugId, {
      include: ["invoice", "institution"],
    });
    if (!drug) throw new CustomError("Not found");
    if (drug.isGiven) throw new CustomError("Already given");

    // check quantity
    const drugInStock = await InstitutionDrugs.findByPk(drug.institutionDrugId);
    if (!drugInStock) throw new CustomError("Drug not found");
    else {
      const drugInStock = await InstitutionDrugs.findByPk(
        drug.institutionDrugId
      );
      await drugInStock?.increment("quantity", { by: drug.quantity });
      await drug.destroy();
      await drug.invoice.decrement("totalCost", { by: drug.totalPrice });
    }

    return true;
  }

  public static async getAll(
    institutionId: string,
    limit: number,
    offset: number,
    startDate: string | undefined,
    endDate: string | undefined,
    requester: string | undefined
  ): Promise<Paged<IInvoiceDTO[]>> {
    const columns: string[] = [];
    let queryOptions: { [key: string]: any } = { institutionId };

    const requesterOpt =
        requester && requester != "all" ? { requesterId: requester } : {},
      datesOpt = DatesOpt(startDate, endDate);

    queryOptions = {
      ...queryOptions,
      ...requesterOpt,
      ...datesOpt,
      ...{ published: true },
    };

    const data = (await InvoiceModel.findAll({
      include: this.includeStatement,
      where: { ...queryOptions },
      ...TimestampsNOrder,
      limit,
      offset,
    })) as unknown as IInvoiceDTO[];
    const totalItems = await InvoiceModel.count({ where: { ...queryOptions } });
    return { data, totalItems };
  }

  public static async getOne(id: string): Promise<IInvoiceDTO | null> {
    return InvoiceModel.findByPk(id, {
      include: [
        "patient",
        "insurance",
        {
          model: UserModel,
          as: "user",
        },
        {
          model: InvoiceDrugsModel,
          as: "drugs",
          include: ["drug", "insuranceDrug"],
        },
        { model: InvoiceExams, as: "exams", include: ["exam"] },
        {
          model: InvoiceConsultations,
          as: "consultations",
          include: ["consultation"],
        },
        {
          model: InstitutionModel,
          as: "institution",
          include: ["parentInstitution"],
        },
      ],
    }) as unknown as IInvoiceDTO;
  }

  public static async delete(id: string): Promise<void> {
    const Invoice = await InvoiceModel.findByPk(id);
    if (!Invoice) {
      throw new CustomError("Invoice not found", 404);
    }
    try {
      await Invoice.destroy();
    } catch (error: any) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new CustomError(
          "Cannot delete Invoice with associated drugs",
          400
        );
      }
      catchSequelizeError({ item: "Invoice", error });
      throw error;
    }
  }

  static includeStatement = [
    "patient",
    "insurance",
    {
      model: UserModel,
      as: "user",
      attributes: ["id", "name", "phone", "institutionId"],
    },
    {
      model: InvoiceDrugsModel,
      as: "drugs",
      include: ["drug", "insuranceDrug"],
    },
    {
      model: InstitutionModel,
      as: "institution",
      attributes: ["id", "name", "institutionId", "institutionType"],
      include: ["parentInstitution"],
    },
  ];

  public static async patientInvoices(
    patientId: string,
    limit: number,
    offset: number,
    startDate: string | undefined,
    endDate: string | undefined,
    type: string | undefined,
    institution: string | undefined
  ): Promise<Paged<IInvoiceDTO[]>> {
    const columns: string[] = [];
    let queryOptions: { [key: string]: any } = { patientId };

    const typeOpt = type && type != "all" ? { typeId: type } : {},
      institutionOpt =
        institution && institution != "all"
          ? { institutionId: institution }
          : {},
      datesOpt = DatesOpt(startDate, endDate);

    queryOptions = {
      ...queryOptions,
      ...typeOpt,
      ...institutionOpt,
      ...datesOpt,
      ...{ published: true },
    };

    const data = (await InvoiceModel.findAll({
      include: this.includeStatement,
      where: { ...queryOptions },
      ...TimestampsNOrder,
      limit,
      offset,
    })) as unknown as IInvoiceDTO[];
    const totalItems = await InvoiceModel.count({ where: { ...queryOptions } });
    return { data, totalItems };
  }
}

export default InvoiceService;
