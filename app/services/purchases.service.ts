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
          totalPrice: drug.unitPrice * drug.qty,
          purchaseId: purchase.id,
          quantity: drug.qty ?? 1,
          institutionId,
        }));
        const x = await DrugPurchasesModel.bulkCreate(drugsAdded, {
          transaction: t,
        });

        let drugs = [];

        if (x[0]) {
          for (let index = 0; index < x.length; index++) {
            const purchase = x[index] as DrugPurchasesModel;
            for (let j = 0; j < purchase.quantity; j++) {
              drugs.push({
                drugId: purchase.drugId,
                purchaseId: purchase.purchaseId,
                drugPurchaseId: purchase.id,
                quantity: 1,
                price: purchase.sellingPrice,
                institutionId,
              });
            }
          }
        }

        await InstitutionDrugs.bulkCreate(drugs, { transaction: t });
        return purchase;
      });
    } catch (error) {
      throw new CustomError("Can not create new Purchase", 500);
    }
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
      limit,
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
          include: [{ model: InstitutionDrugs }, { model: DrugModel }],
        },
        { model: InstitutionDrugs },
      ],
    });
    return result;
  }

  public static async drugBatchNumbers(
    data: IAdjustPurchaseDTO
  ): Promise<boolean> {
    try {
      await Promise.all(
        data.drugs?.map(async (drug) => {
          const drugData = {
            ...drug,
            batchNumber: drug.batchNumber == "" ? null : drug.batchNumber,
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
}

export default PurchaseService;