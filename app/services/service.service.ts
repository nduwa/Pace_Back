import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { Paged } from "../type";
import ServiceModel from "../database/models/Services";
import { IService, IServiceRequest } from "../type/service";
import { Op } from "sequelize";
import InstitutionModel from "../database/models/Institution";

class ServiceService {
  public static async getOne(id: string): Promise<IService | null> {
    return (await ServiceModel.findByPk(id, {
      include: ["acts"],
    })) as unknown as IService;
  }

  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<IService[]>> {
    let queryOptions = QueryOptions(["label", "level"], searchq);
    if (institutionId != null) {
      const institution = await InstitutionModel.findByPk(institutionId);
      if (institution)
        queryOptions = { ...queryOptions, ...{ level: institution.level } };
    }
    const institutionOpt = {
      [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
    };

    queryOptions = { [Op.and]: [[queryOptions], [institutionOpt]] };

    const data = (await ServiceModel.findAll({
      where: {
        ...queryOptions,
      },
      include: ["acts"],
      ...TimestampsNOrder,

      limit,
      offset,
    })) as unknown as IService[];

    const totalItems = await ServiceModel.count({
      where: {
        ...queryOptions,
      },
    });
    return { data, totalItems };
  }

  public static async create(data: IServiceRequest): Promise<IService> {
    const [service] = await ServiceModel.findOrCreate({
      where: { label: data.label },
      defaults: { ...data },
    });

    return service.toJSON();
  }

  public static async update(
    id: string,
    data: IServiceRequest
  ): Promise<boolean> {
    try {
      await ServiceModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await ServiceModel.destroy({ where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async getNPaged(
    institutionId: string | null
  ): Promise<IService[]> {
    let queryOptions: Record<any, any> = {};

    if (institutionId != null) {
      const institution = await InstitutionModel.findByPk(institutionId);
      if (institution)
        queryOptions = { ...queryOptions, ...{ level: institution.level } };
    }
    const institutionOpt = {
      [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
    };

    queryOptions = { ...queryOptions, ...institutionOpt };

    const data = await ServiceModel.findAll({ where: queryOptions });
    return data as unknown as IService[];
  }
}

export default ServiceService;
