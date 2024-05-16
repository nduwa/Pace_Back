import {
  IAdjustPurchaseDTO,
  ICreatePurchaseDTO,
  IPurchase,
} from "../type/drugs";
import db from "../config/db.config";
import PurchasesModel from "../database/models/PurchasesModel";
import DrugPurchasesModel from "../database/models/DrugPurchases";
import CustomError from "../utils/CustomError";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import { Paged } from "../type";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import DrugModel from "../database/models/DrugModel";

class PurchaseService {
  public static async createPurchase(
    institutionId: string,
    data: ICreatePurchaseDTO
  ): Promise<IPurchase> {
    try {
      return db.transaction(async (t) => {
        const addedDrugsCount = data.drugs.reduce((a, b) => a + b.qty, 0);
        const totalDrugsCost = data.drugs.reduce(
          (prev, curr) => prev + curr.qty * curr.unitPrice,
          0
        );

        const purchase = await PurchasesModel.create(
          {
            note: data.note,
            date: new Date(data.date),
            drugsCount: addedDrugsCount,
            totalCost: totalDrugsCost,
            supplier: data.supplier,
            institutionId,
          },
          { transaction: t }
        );

        const drugsAdded = data.drugs.map((drug) => ({
          drugId: drug.drug,
          unitPrice: drug.unitPrice,
          sellingPrice: drug.sellingPrice,
          batchNumber: drug.batchNumber,
          expireDate: drug.expireDate,
          totalPrice: drug.unitPrice * drug.qty,
          purchaseId: purchase.id,
          quantity: drug.qty ?? 1,
          institutionId,
        }));

        await DrugPurchasesModel.bulkCreate(drugsAdded, { transaction: t });

        return purchase;
      });
    } catch (error) {
      throw new CustomError("Can not create new Purchase", 500);
    }
  }

  public static async update(
    id: string,
    institutionId: string,
    data: ICreatePurchaseDTO
  ) {
    const old = await PurchasesModel.findByPk(id);
    if (old?.approved) throw new CustomError("Purchase is approved");

    const purchase = await this.createPurchase(institutionId, {
      ...data,
      id: undefined,
    });
    await this.destroy(id);
    await PurchasesModel.update(
      { purchaseNO: old?.purchaseNO },
      { where: { id: purchase.id } }
    );
    return purchase;
  }

  public static async approve(id: string) {
    const x = await DrugPurchasesModel.findAll({
      where: { purchaseId: id },
    });
    const old = await PurchasesModel.findByPk(id);
    if (old?.approved) throw new CustomError("Purchase is approved");

    if (x[0]) {
      for (let index = 0; index < x.length; index++) {
        const purchase = x[index] as DrugPurchasesModel;
        const drugData = {
          drugId: purchase.drugId,
          batchNumber: purchase.batchNumber,
          expireDate: purchase.expireDate,
          quantity: purchase.quantity,
          price: purchase.sellingPrice,
          institutionId: purchase.institutionId,
          isAvailable: true,
        };

        const [institutionDrug, created] = await InstitutionDrugs.findOrCreate({
          where: {
            drugId: purchase.drugId,
            institutionId: purchase.institutionId,
            batchNumber: purchase.batchNumber,
          },
          defaults: { ...drugData },
        });

        if (!created) {
          await institutionDrug.increment("quantity", {
            by: drugData.quantity,
          });
          if (drugData.quantity > 0) {
            await InstitutionDrugs.update(
              {
                isAvailable: true,
              },
              { where: { id: institutionDrug.id } }
            );
          }
        }
      }

      await PurchasesModel.update({ approved: true }, { where: { id } });
    }
    return this.getOne(id);
  }

  static async getAllPurchases(
    institutionId: string,
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<IPurchase[]>> {
    let queryOptions = QueryOptions(["note", "supplier"], searchq);
    queryOptions = { ...queryOptions, institutionId };

    const data = await PurchasesModel.findAll({
      ...TimestampsNOrder,
      where: { ...queryOptions },
      include: [{ model: DrugPurchasesModel, include: [DrugModel] }],
      limit,
      order: [["purchaseNO", "DESC"]],
      offset,
    });
    const list: IPurchase[] = data.map((purchase) => purchase.toJSON());
    const totalItems = await PurchasesModel.count({
      where: { ...queryOptions },
    });
    return { data: list, totalItems };
  }

  static async getOne(id: string): Promise<IPurchase | null> {
    const result = await PurchasesModel.findOne({
      where: { id },
      include: [
        {
          model: DrugPurchasesModel,
          include: [{ model: DrugModel }],
        },
      ],
    });
    return result;
  }

  public static async drugsAdjust(data: IAdjustPurchaseDTO): Promise<boolean> {
    try {
      await Promise.all(
        data.drugs?.map(async (drug) => {
          const drugData = {
            ...drug,
            batchNumber: drug.batchNumber == "" ? null : drug.batchNumber,
            expireDate: drug.expireDate == "" ? null : drug.expireDate,
          };
          if (drug.id !== undefined) {
            await InstitutionDrugs.update(drugData, {
              where: { id: drugData.id },
            });
          }
        })
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  public static async destroy(id: string) {
    await DrugPurchasesModel.destroy({ where: { drugId: id } });
    return await PurchasesModel.destroy({ where: { id } });
  }
}

export default PurchaseService;
