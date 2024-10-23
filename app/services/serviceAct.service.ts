import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { Paged } from "../type";
import { IServiceAct, IServiceActRequest } from "../type/service";
import ServiceAct from "../database/models/ServiceAct";
import { IPriceChange } from "../type/drugs";
import InstitutionAct from "../database/models/InstututionAct";
import InstitutionModel from "../database/models/Institution";
import { Op } from "sequelize";
import Service from "../database/models/Services";

class ServiceActService {
  public static async getOne(id: string): Promise<IServiceAct | null> {
    return (await ServiceAct.findByPk(id)) as unknown as IServiceAct;
  }

  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<IServiceAct[]>> {
    let queryOptions = QueryOptions(["label"], searchq);

    let institution: InstitutionModel | null = null;
    if (institutionId != null) {
      institution = await InstitutionModel.findByPk(institutionId);
      if (institution) queryOptions = { ...queryOptions };
    }

    const institutionOpt = {
      [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
    };

    queryOptions = {
      [Op.and]: [queryOptions, institutionOpt],
    };

    const data = (await ServiceAct.findAll({
      where: {
        ...queryOptions,
      },

      include: [
        {
          model: InstitutionAct,
          as: "institutionAct",
          required: false,
          where: institutionOpt,
        },
        {
          model: Service,
          as: "service",
          required: true,
          where: institution ? { level: institution.level } : {},
        },
      ],

      ...TimestampsNOrder,

      limit,
      offset,
    })) as unknown as IServiceAct[];

    const totalItems = await ServiceAct.count({
      where: {
        ...queryOptions,
      },
      include: [
        {
          model: Service,
          as: "service",
          required: true,
          where: institution ? { level: institution.level } : {},
        },
      ],
    });
    return { data, totalItems };
  }

  public static async create(data: IServiceActRequest): Promise<IServiceAct> {
    const [serviceAct] = await ServiceAct.findOrCreate({
      where: { label: data.label },
      defaults: { ...data },
    });

    return serviceAct.toJSON();
  }

  public static async update(
    id: string,
    data: IServiceActRequest
  ): Promise<boolean> {
    try {
      await ServiceAct.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await ServiceAct.destroy({ where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async getNPaged(
    institutionId: string | null
  ): Promise<IServiceAct[]> {
    const data = await ServiceAct.findAll({
      include: [
        {
          model: InstitutionAct,
          as: "institutionAct",
          required: false,
          where: { institutionId },
        },
      ],
    });
    return data as unknown as IServiceAct[];
  }

  public static async updatePrice(
    data: IPriceChange,
    institutionId: string,
    serviceActId: string
  ) {
    const [priceInDB, created] = await InstitutionAct.findOrCreate({
      where: {
        serviceActId,
        institutionId,
      },
      defaults: { price: data.price, serviceActId, institutionId },
    });

    if (!created) {
      await InstitutionAct.update(
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

export default ServiceActService;
