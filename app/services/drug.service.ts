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
  IInsuranceDrug,
  IMatchPrices,
  IPriceChange,
} from "../type/drugs";
import DrugPurchasesModel from "../database/models/DrugPurchases";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import InsuranceDrugs from "../database/models/InsuranceDrugs";

class DrugService {
  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined,
    isOnMarket: string | undefined,
    drugCategory: string | undefined,
    type: string = "drugs"
  ): Promise<Paged<DrugModel[] | InsuranceDrugs[]>> {
    let queryOptions = QueryOptions(
      ["designation", "drugCategory", "drug_code", "instruction"],
      searchq
    );

    const institutionOpt = {
      [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
    };

    const drugCategoryOpt =
      drugCategory && drugCategory != "all" ? { drugCategory } : {};

    queryOptions = {
      [Op.and]: [queryOptions, type == "drugs" ? institutionOpt : {}],
      ...drugCategoryOpt,
    };

    if (type == "drugs") {
      queryOptions = {
        [Op.and]: [queryOptions, type == "drugs" ? institutionOpt : {}],
        ...drugCategoryOpt,
      };
      const data = await DrugModel.findAll({
        include: [
          "institution",
          {
            model: InsuranceDrugs,
            as: "insuranceDrug",
            required: false,
          },
        ],
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
    } else {
      queryOptions = {
        ...queryOptions,
        ...drugCategoryOpt,
      };

      const data = await InsuranceDrugs.findAll({
        include: ["drug"],
        where: {
          ...queryOptions,
        },
        ...TimestampsNOrder,
        order: [["drug_code", "ASC"]],
        limit,
        offset,
      });

      const totalItems = await InsuranceDrugs.count({
        where: {
          ...queryOptions,
        },
      });

      return { data, totalItems };
    }
  }

  public static async getInstitutionDrugs(
    institutionId: string | null,
    limit: number,
    offset: number,
    listType: string,
    drug: string | undefined
  ): Promise<Paged<IInstitutionDrug[]>> {
    const drugOpt =
      drug && drug != "all"
        ? { [Op.or]: [{ drugId: drug }, { insuranceDrugId: drug }] }
        : {};

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
      const drugId = item.drugId;
      const insuranceDrugId = item.insuranceDrugId;

      const index = result.findIndex((drug) =>
        insuranceDrugId !== null
          ? (drug.insuranceDrugId = insuranceDrugId)
          : drug.drugId == drugId
      );

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
    let pageData = result.slice(
      offset,
      offset + limit
    ) as unknown as IInstitutionDrug[];

    const res = await this.getPrices(pageData, true);

    const totalItems = result.length;

    return { data: res, totalItems };
  }
  static async withBatchNumbers(
    queryOptions: { [key: string]: any },
    limit: number,
    offset: number
  ) {
    const data = (await InstitutionDrugs.findAll({
      where: { ...queryOptions },
      ...TimestampsNOrder,
      include: ["drug", "insuranceDrug"],
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

  public static async getAllWithNoInsuranceNPaged(): Promise<IDrugDTO[]> {
    const drugs = await DrugModel.findAll({
      include: [
        {
          model: InsuranceDrugs,
          required: false, // This makes it a LEFT JOIN
          where: {
            id: null, // Only select rows where there's no corresponding entry in InsuranceDrugModel
          },
        },
      ],
      order: [["drug_code", "ASC"]],
    });

    return drugs as unknown as IDrugDTO[];
  }

  public static async getAllInsuranceDrugsNPaged(): Promise<IInsuranceDrug[]> {
    const drugs = await InsuranceDrugs.findAll({
      include: ["drug"],
      order: [["drug_code", "ASC"]],
    });

    return drugs as unknown as IInsuranceDrug[];
  }

  public static async insurancePriceMatching(
    data: IMatchPrices[]
  ): Promise<boolean> {
    await Promise.all(
      data.map(async (d) => {
        await InsuranceDrugs.update({ ...d }, { where: { id: d.id } });
      })
    );
    return true;
  }

  public static async getAllInstitutionNPaged(
    institutionId: string | null
  ): Promise<IInstitutionDrug[]> {
    const data = await InstitutionDrugs.findAll({
      where: { institutionId, quantity: { [Op.gte]: 0 } },
      ...TimestampsNOrder,
      attributes: { include: ["price"] },
      include: ["drug", "insuranceDrug"],
      order: ["price", "expireDate"],
    });

    // const result = await this.getPrices(data);

    return data as unknown as IInstitutionDrug[];
  }

  public static async getPrices(
    drugs: InstitutionDrugs[] | IInstitutionDrug[],
    alreadyJSON: boolean = false
  ) {
    const ids = drugs.map((drug) => drug.drugId);
    if (drugs.length == 0) return [];

    const institutionId = drugs[0].institutionId;

    const highPrices = await InstitutionDrugs.findAll({
      where: {
        drugId: { [Op.in]: ids },
        quantity: { [Op.gt]: 0 },
        institutionId,
      },
      attributes: [
        "drugId",
        [Sequelize.fn("max", Sequelize.col("price")), "maxPrice"], // Max price per group
      ],
    });

    let drugPrices: { [key: string]: number } = {};
    for (const record of highPrices) {
      drugPrices[record.insuranceDrugId ?? record.drugId] = record.price;
    }

    const result: IInstitutionDrug[] = drugs.map((drug) => {
      const drugJSON = alreadyJSON ? drug : (drug as InstitutionDrugs).toJSON();
      return {
        ...drugJSON,
        price: drugPrices[drug.insuranceDrugId ?? drug.drugId],
      };
    });

    return result;
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
    const existingDrug =
      data.type && data.type != "drug"
        ? await InsuranceDrugs.findOne({
            where: { drug_code: data.drug_code },
          })
        : await DrugModel.findOne({
            where: { drug_code: data.drug_code, institutionId },
          });

    if (existingDrug) throw new CustomError("Drug Code already exist", 409);

    const createDrug =
      data.type && data.type != "drug"
        ? await InsuranceDrugs.create({ ...data })
        : await DrugModel.create({
            ...data,
            institutionId,
            isOnMarket: true,
          });
    const drug = createDrug.toJSON();

    return drug;
  }

  public static async update(id: string, data: IDrugRequest): Promise<boolean> {
    try {
      if (!data.type || data.type == "drug") {
        const existingDrug = await DrugModel.findOne({
          where: { drug_code: data.drug_code, id: { [Op.ne]: id } },
        });
        if (existingDrug) throw new CustomError("Drug Code already exist", 409);

        await DrugModel.update({ ...data }, { where: { id: id } });
      } else {
        console.log("insurance edit", data);
        const existingDrug = await InsuranceDrugs.findOne({
          where: { drug_code: data.drug_code, id: { [Op.ne]: id } },
        });
        if (existingDrug) throw new CustomError("Drug Code already exist", 409);

        await InsuranceDrugs.update({ ...data }, { where: { id: id } });
      }
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
      include: ["purchase", "drug", "insuranceDrug"],
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

  public static async updatePrice(
    data: IPriceChange,
    institutionId: string,
    drugId: string
  ) {
    await InstitutionDrugs.update(
      {
        price: data.price,
      },
      {
        where: {
          quantity: { [Op.gt]: 0 },
          institutionId,
          id: drugId,
        },
      }
    );

    return true;
  }

  public static async updateInsurancePrice(
    data: IPriceChange,
    institutionId: string,
    drugId: string
  ) {
    const [priceInDB, created] = await InsuranceDrugs.findOrCreate({
      where: {
        drugId,
        institutionId,
      },
      defaults: { price: data.price, drugId, institutionId },
    });

    if (!created) {
      await InsuranceDrugs.update(
        {
          price: data.price,
        },
        {
          where: { id: priceInDB.id },
        }
      );
    }

    return true;
  }
}

export default DrugService;
