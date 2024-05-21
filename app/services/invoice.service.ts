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
import { TimestampsNOrder } from "../utils/DBHelpers";
import InstitutionModel from "../database/models/Institution";
import DrugService from "./drug.service";

class InvoiceService {
  public static async create(
    data: ICreateInvoiceDTO,
    userId: string,
    institutionId: string
  ): Promise<IInvoiceDTO> {
    const patientId =
      data.patientId && data.patientId.length > 0 ? data.patientId : undefined;
    const createdInvoice = await InvoiceModel.create({
      ...data,
      drugs: undefined,
      patientId,
      userId: userId,
      institutionId,
      totalCost: 0,
      drugsCount: 0,
    });

    const requestedDrugsIds = data.drugs.map((drug) => drug.drug);

    const requestedDrugs = await InstitutionDrugs.findAll({
      where: { id: { [Op.in]: requestedDrugsIds } },
      include: ["drug"],
    }).then(async (drugs) => {
      return DrugService.getPrices(drugs);
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

    let totalCost = 0;
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
              }
            );

          quantityRemaining -= availableToGive;
          quantityGiven += availableToGive;
        }

        if (quantityGiven) {
          const cost = requestedDrugs[index].price * quantityGiven;

          await InvoiceDrugsModel.create({
            institutionId,
            drugId,
            patientId,
            quantity: quantityGiven,
            unitPrice: requestedDrugs[index].price,
            totalPrice: cost,
            invoiceId: createdInvoice.id,
          });

          totalCost += cost;
        }
      })
    );

    await InvoiceModel.update(
      {
        totalCost: totalCost,
        drugsCount: data.drugs.length,
      },
      {
        where: { id: createdInvoice.id },
      }
    );

    const Invoice = (await InvoiceModel.findByPk(createdInvoice.id, {
      include: this.includeStatement,
    })) as unknown as IInvoiceDTO;

    return Invoice;
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
      datesOpt = {
        [Op.and]: [
          startDate ? { createdAt: { [Op.gte]: startDate } } : {},
          endDate ? { createdAt: { [Op.lte]: endDate } } : {},
        ],
      };

    queryOptions = {
      ...queryOptions,
      ...requesterOpt,
      ...datesOpt,
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
        {
          model: UserModel,
          as: "user",
        },
        { model: InvoiceDrugsModel, as: "drugs", include: ["drug"] },
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
    {
      model: UserModel,
      as: "user",
    },
    { model: InvoiceDrugsModel, as: "drugs", include: ["drug"] },
    {
      model: InstitutionModel,
      as: "institution",
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
      datesOpt = {
        [Op.and]: [
          startDate ? { createdAt: { [Op.gte]: startDate } } : {},
          endDate ? { createdAt: { [Op.lte]: endDate } } : {},
        ],
      };

    queryOptions = {
      ...queryOptions,
      ...typeOpt,
      ...institutionOpt,
      ...datesOpt,
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
