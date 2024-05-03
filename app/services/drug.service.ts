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
    searchq: string | undefined,
    isOnMarket: string | undefined,
    drugCategory: string | undefined
  ): Promise<Paged<DrugModel[]>> {
    let queryOptions = QueryOptions(
      ["designation", "drugCategory", "drug_code", "instruction"],
      searchq
    );

    const drugCategoryOpt =
      drugCategory && drugCategory != "all" ? { drugCategory } : {};
    const isOnMarketOpt =
      isOnMarket && isOnMarket != "all"
        ? { isOnMarket: isOnMarket == "no" ? false : true }
        : {};

    queryOptions = {
      ...queryOptions,
      ...drugCategoryOpt,
      ...isOnMarketOpt,
    };

    const data = await DrugModel.findAll({
      include: ["institution"],
      where: {
        ...queryOptions,
      },
      ...TimestampsNOrder,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT 
                  SUM(CASE WHEN "quantity" IS NULL THEN 1 ELSE "quantity" END)
              FROM "institution_drugs" AS "drug"
              WHERE 
                  "drug"."drugId" = "DrugModel"."id" 
                  AND "drug"."isAvailable" = true 
                  ${
                    institutionId
                      ? `AND "drug"."institutionId" = '${institutionId}'`
                      : " AND 1=0"
                  }
          )`),
            "totalQuantity",
          ],
        ],
      },
      order: [["drug_code", "ASC"]],
      group: [
        "DrugModel.id", // Group by primary key of DrugModel
        "institution.id", // Group by primary key of Institution
      ],
    });

    const filteredData = data.filter(
      (record) => (record.toJSON()?.totalQuantity || 0) > 0
    );

    // Apply pagination with limit and offset
    const pageData = filteredData.slice(offset, offset + limit);
    const totalItems = filteredData.length;

    return { data: pageData, totalItems };
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
  ): Promise<IDrugDTO[]> {
    const drugs = await DrugModel.findAll({
      include: ["institution"],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT 
                  SUM(CASE WHEN "quantity" IS NULL THEN 1 ELSE "quantity" END)
              FROM "institution_drugs" AS "drug"
              WHERE 
                  "drug"."drugId" = "DrugModel"."id" 
                  AND "drug"."isAvailable" = true 
                  ${
                    institutionId
                      ? `AND "drug"."institutionId" = '${institutionId}'`
                      : " AND 1=0"
                  }
          )`),
            "totalQuantity",
          ],
        ],
      },
      order: [["drug_code", "ASC"]],
      group: [
        "DrugModel.id", // Group by primary key of DrugModel
        "institution.id", // Group by primary key of Institution
      ],
    });

    const filteredData = drugs.filter(
      (record) => (record.toJSON()?.totalQuantity || 0) > 0
    );

    return filteredData as unknown as IDrugDTO[];
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

  public static async getDrugsByPurchase(
    id: string
  ): Promise<IInstitutionDrug[]> {
    return await InstitutionDrugs.findAll({
      where: { drugPurchaseId: id },
    });
  }

  public static async getDrugsByInstitution(
    institutionId: string
  ): Promise<IInstitutionDrug[]> {
    return await InstitutionDrugs.findAll({
      where: { institutionId, quatity: { [Op.gt]: 0 } },
    });
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
      include: ["purchase", "drug", "drugs"],
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
