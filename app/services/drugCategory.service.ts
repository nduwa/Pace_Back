import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { Paged } from "../type";
import { IDrugCategory, IDrugCategoryRequest } from "../type/drugs";
import DrugCategory from "../database/models/DrugCategory";

class DrugCategoryService {
  public static async getOne(id: string): Promise<IDrugCategory | null> {
    return (await DrugCategory.findByPk(id)) as unknown as IDrugCategory;
  }

  public static async getAll(
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<DrugCategory[]>> {
    let queryOptions = QueryOptions(["name"], searchq);

    const data = await DrugCategory.findAll({
      where: {
        ...queryOptions,
      },
      ...TimestampsNOrder,

      limit,
      offset,
    });

    const totalItems = await DrugCategory.count({
      where: {
        ...queryOptions,
      },
    });
    return { data, totalItems };
  }

  public static async create(
    data: IDrugCategoryRequest
  ): Promise<IDrugCategory> {
    const [category] = await DrugCategory.findOrCreate({
      where: { name: data.name },
      defaults: { ...data },
    });

    return category.toJSON();
  }

  public static async update(
    id: string,
    data: IDrugCategoryRequest
  ): Promise<boolean> {
    try {
      await DrugCategory.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await DrugCategory.destroy({ where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async getByType(name: string): Promise<IDrugCategory[]> {
    const data = await DrugCategory.findAll({ where: { drugCategory: name } });
    return data as unknown as IDrugCategory[];
  }

  public static async getNPaged(): Promise<IDrugCategory[]> {
    const data = await DrugCategory.findAll();
    return data as unknown as IDrugCategory[];
  }
}

export default DrugCategoryService;
