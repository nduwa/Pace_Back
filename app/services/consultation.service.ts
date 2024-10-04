import { Op, Sequelize, where } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import { Paged } from "../type";
import Consultations from "../database/models/Consultations";
import {
  IConsultation,
  IConsultationDTO,
  IConsultationRequest,
} from "../type/instutution";

class ConsultationService {
  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<Consultations[]>> {
    let queryOptions = QueryOptions(["label"], searchq);

    const institutionOpt = {
      institutionId: institutionId,
    };

    queryOptions = {
      ...queryOptions,
      ...institutionOpt,
    };

    const data = await Consultations.findAll({
      where: queryOptions,
      ...TimestampsNOrder,
      include: ["service"],
      limit,
      offset,
    });

    const totalItems = await Consultations.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }

  public static async getOne(id: string): Promise<IConsultationDTO> {
    const consultation = await Consultations.findByPk(id, {});

    return consultation as unknown as IConsultationDTO;
  }

  public static async getAllNPaged(
    institutionId: string | null
  ): Promise<IConsultationDTO[]> {
    const consultations = await Consultations.findAll({
      where: {
        [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
      },
      include: ["service"],
    });

    return consultations as unknown as IConsultationDTO[];
  }

  public static async create(
    institutionId: string | null,
    data: IConsultationRequest
  ): Promise<IConsultation> {
    const createConsultation = await Consultations.create({
      ...data,
      institutionId,
    });
    const consultation = createConsultation.toJSON();

    return consultation;
  }

  public static async update(
    id: string,
    data: IConsultationRequest
  ): Promise<boolean> {
    try {
      await Consultations.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async delete(id: string): Promise<number> {
    return await Consultations.destroy({ where: { id: id } });
  }

  public static async assignServices(
    institutionId: string | null,
    data: IConsultationRequest
  ): Promise<boolean> {
    let existingConsultations = await Consultations.findAll({
      where: { institutionId },
      include: ["service"],
      paranoid: false,
    });

    const existingConsultationsIds = existingConsultations.map(
      (service) => service.serviceId
    );
    const updatedConsultationsIds = data.services.map((s) => s.serviceId) || [];

    const servicesToDelete = existingConsultationsIds.filter(
      (service) => !updatedConsultationsIds.includes(service)
    );

    await Consultations.update(
      { deletedAt: new Date() },
      {
        where: {
          institutionId,
          serviceId: { [Op.in]: servicesToDelete },
        },
        paranoid: false,
      }
    );

    await Promise.all(
      updatedConsultationsIds.map(async (serviceId) => {
        const [r, created] = await Consultations.findOrCreate({
          where: { serviceId: serviceId, institutionId },
          defaults: {
            serviceId: serviceId,
            institutionId,
          },
          paranoid: false,
        });

        if (!created && r.deletedAt) {
          console.log("setting to null");
          const [rows] = await Consultations.update(
            { deletedAt: null },
            {
              where: {
                id: r.id,
              },
              paranoid: false,
            }
          );
          console.log(rows);
        }
      })
    );

    return true;
  }
}

export default ConsultationService;
