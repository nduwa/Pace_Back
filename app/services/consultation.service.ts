import { Op, Sequelize } from "sequelize";
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
}

export default ConsultationService;
