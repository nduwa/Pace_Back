import { Op, Sequelize } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { Paged } from "../type";
import DrugModel from "../database/models/DrugModel";
import {
  IDrug,
  IDrugDTO,
  IDrugPurchase,
  IDrugRequest,
  IInstitutionDrug,
  IPurchaseDrugDTO,
} from "../type/drugs";
import DrugPurchasesModel from "../database/models/DrugPurchases";
import InstitutionDrugs from "../database/models/InstututionDrugs";

class DrugService {
  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined,
    isOnMarket: string | undefined,
    drugCategory: string | undefined
  ): Promise<Paged<DrugModel[]>> {
    let queryOptions = QueryOptions(
      ["designation", "drugCategory", "drug_code", "instruction"],
      searchq
    );

    const institutionOpt = {
      [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
    };

    const drugCategoryOpt =
      drugCategory && drugCategory != "all" ? { drugCategory } : {};
    const isOnMarketOpt =
      isOnMarket && isOnMarket != "all"
        ? { isOnMarket: isOnMarket == "no" ? false : true }
        : {};

    queryOptions = {
      [Op.and]: [queryOptions, institutionOpt],
      ...drugCategoryOpt,
      ...isOnMarketOpt,
    };

    const data = await DrugModel.findAll({
      include: ["institution"],
      where: {
        ...queryOptions,
      },
      ...TimestampsNOrder,
      order: [["drug_code", "ASC"]],
      limit,
      offset,
    });

    const totalItems = await DrugModel.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }

  public static async getInstitutionDrugs(
    institutionId: string | null,
    limit: number,
    offset: number,
    listType: string,
    drug: string | undefined
  ): Promise<Paged<IInstitutionDrug[]>> {
    const drugOpt = drug && drug != "all" ? { drugId: drug } : {};

    let queryOptions = { institutionId, quantity: { [Op.gte]: 0 }, ...drugOpt };

    if (listType == "batchNumbers") {
      return this.withBatchNumbers(queryOptions, limit, offset);
    }

    return this.groupedByDrug(queryOptions, limit, offset);
  }
  static async groupedByDrug(
    queryOptions: { [key: string]: any },
    limit: number,
    offset: number
  ) {
    const data = await InstitutionDrugs.findAll({
      where: { ...queryOptions },
      ...TimestampsNOrder,
      include: ["drug"],
      order: ["expireDate"],
    });

    const result: IInstitutionDrug[] = [];

    data.forEach((drug) => {
      const item = drug.toJSON() as unknown as IInstitutionDrug;
      const drugId = item?.drug?.id;

      const index = result.findIndex((drug) => drug.drugId == drugId);

      if (index == -1) {
        result.push({
          ...item,
          totalQuantity: item.quantity,
        } as unknown as IInstitutionDrug);
      } else {
        result[index] = {
          ...result[index],
          totalQuantity: (result[index]?.totalQuantity || 1) + item.quantity,
        };
      }
    });

    // Apply pagination with limit and offset
    const pageData = result.slice(
      offset,
      offset + limit
    ) as unknown as IInstitutionDrug[];
    const totalItems = result.length;

    return { data: pageData, totalItems };
  }
  static async withBatchNumbers(
    queryOptions: { [key: string]: any },
    limit: number,
    offset: number
  ) {
    const data = (await InstitutionDrugs.findAll({
      where: { ...queryOptions },
      ...TimestampsNOrder,
      include: ["drug"],
      order: ["expireDate"],
      limit,
      offset,
    })) as unknown as IInstitutionDrug[];

    const totalItems = await InstitutionDrugs.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }

  public static async getOne(id: string): Promise<IDrugDTO> {
    const drug = await DrugModel.findByPk(id, {
      include: ["institution"],
    });

    return drug as unknown as IDrugDTO;
  }

  public static async getAllNPaged(
    institutionId: string | null
  ): Promise<IDrugDTO[]> {
    const drugs = await DrugModel.findAll({
      where: {
        [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
      },
      include: ["institution"],
      order: [["drug_code", "ASC"]],
    });

    return drugs as unknown as IDrugDTO[];
  }

  public static async getAllInstitutionNPaged(
    institutionId: string | null
  ): Promise<IInstitutionDrug[]> {
    const data = (await InstitutionDrugs.findAll({
      where: { institutionId, quantity: { [Op.gte]: 0 } },
      ...TimestampsNOrder,
      include: ["drug"],
      order: ["expireDate"],
    })) as unknown as IInstitutionDrug[];

    return data;
  }

  public static async getAllInstitutionGroupedNPaged(
    institutionId: string | null
  ): Promise<IInstitutionDrug[]> {
    const data = await InstitutionDrugs.findAll({
      where: { institutionId, quantity: { [Op.gte]: 0 } },
      ...TimestampsNOrder,
      include: ["drug"],
      order: ["expireDate"],
    });

    const result: IInstitutionDrug[] = [];

    data.forEach((drug) => {
      const item = drug.toJSON() as unknown as IInstitutionDrug;
      const drugId = item?.drug?.id;

      const index = result.findIndex((drug) => drug.drugId == drugId);

      if (index == -1) {
        result.push({
          ...item,
          totalQuantity: item.quantity,
        } as unknown as IInstitutionDrug);
      }
    });

    return result;
  }

  public static async create(
    institutionId: string | null,
    data: IDrugRequest
  ): Promise<IDrug> {
    const existingDrug = await DrugModel.findOne({
      where: { drug_code: data.drug_code, institutionId },
    });

    if (existingDrug) throw new CustomError("Drug Code already exist", 409);

    const createDrug = await DrugModel.create({
      ...data,
      institutionId,
      isOnMarket: true,
    });
    const drug = createDrug.toJSON();

    return drug;
  }

  public static async update(id: string, data: IDrugRequest): Promise<boolean> {
    try {
      const existingDrug = await DrugModel.findOne({
        where: { drug_code: data.drug_code, id: { [Op.ne]: id } },
      });
      if (existingDrug) throw new CustomError("Drug Code already exist", 409);

      await DrugModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async delete(id: string): Promise<number> {
    return await DrugModel.destroy({ where: { id: id } });
  }

  public static async getCategories(): Promise<string[]> {
    const categories = await DrugModel.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("drugCategory")),
          "drugCategory",
        ],
      ],
    });
    const array = categories.map((category) => category.drugCategory);

    return array;
  }

  public static async getDrugsByPurchase(id: string): Promise<IDrugPurchase[]> {
    return (await DrugPurchasesModel.findAll({
      where: { purchaseId: id },
    })) as unknown as IDrugPurchase[];
  }

  public static async getDrugsByInstitution(
    institutionId: string
  ): Promise<IInstitutionDrug[]> {
    return (await InstitutionDrugs.findAll({
      where: { institutionId, quatity: { [Op.gt]: 0 } },
    })) as unknown as IInstitutionDrug[];
  }

  public static async getDrugPurchaseHistory(
    institutionId: string,
    limit: number,
    offset: number
  ): Promise<Paged<DrugPurchasesModel[]>> {
    let queryOptions = { institutionId };

    const data = await DrugPurchasesModel.findAll({
      ...TimestampsNOrder,
      where: { institutionId },
      include: ["purchase", "drug"],
      limit,
      offset,
    });

    const totalItems = await DrugPurchasesModel.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }
}

export default DrugService;
