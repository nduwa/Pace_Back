import { Op, Sequelize } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import { Paged } from "../type";
import PatientsModel from "../database/models/PatientsModel";
import { IPatient, IPatientDTO, IPatientRequest } from "../type/drugs";
import CustomError from "../utils/CustomError";
class PatientService {
  public static async getAll(
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<IPatientDTO[]>> {
    let queryOptions = QueryOptions(
      ["name", "NID", "patientNO", "phone"],
      searchq
    );

    const data = await PatientsModel.findAll({
      where: queryOptions,
      ...TimestampsNOrder,
      order: [["patientNO", "DESC"]],
      limit,
      offset,
    });

    const dataWithDependents: IPatientDTO[] = [];

    await Promise.all(
      data.map(async (patient) => {
        const dependents =
          patient.NIDIndex != 0
            ? []
            : ((await PatientsModel.findAll({
                where: {
                  id: { [Op.ne]: patient.id },
                  NID: patient.NID,
                },
              })) as unknown as IPatient[]);

        const data: IPatientDTO = {
          ...(patient.toJSON() as unknown as IPatient),
          dependents,
        };

        dataWithDependents.push(data);
      })
    );

    const totalItems = await PatientsModel.count({
      where: {
        ...queryOptions,
      },
    });

    return { data: dataWithDependents, totalItems };
  }

  public static async getOne(id: string): Promise<IPatientDTO> {
    const Patient = await PatientsModel.findByPk(id, {
      include: ["invoices"],
    });
    const dependents =
      Patient?.NIDIndex != 0
        ? []
        : ((await PatientsModel.findAll({
            where: {
              id: { [Op.ne]: Patient?.id },
              NID: Patient?.NID,
            },
          })) as unknown as IPatient[]);

    const patientJSON: IPatient | undefined = Patient?.toJSON();

    return { ...patientJSON, dependents } as unknown as IPatientDTO;
  }

  public static async getAllNPaged(
    searchq: string | undefined
  ): Promise<IPatientDTO[]> {
    let queryOptions = QueryOptions(
      ["name", "NID", "patientNO", "phone"],
      searchq
    );
    const Patients = await PatientsModel.findAll({
      ...TimestampsNOrder,
      where: queryOptions,
      order: [["patientNO", "ASC"]],
    });

    return Patients as unknown as IPatientDTO[];
  }

  public static async create(data: IPatientRequest): Promise<IPatient> {
    const patientWithNID = await PatientsModel.findOne({
      where: { NID: data.NID },
    });
    if (patientWithNID)
      throw new CustomError(
        "Patient with same NID exists. Use add dependant instead",
        409
      );

    const createPatient = await PatientsModel.create({
      ...data,
    });
    const Patient = createPatient.toJSON();

    return Patient;
  }

  public static async addDependant(
    id: string,
    data: IPatientRequest
  ): Promise<IPatient> {
    const parent = await PatientsModel.findByPk(id);

    const createPatient = await PatientsModel.create({
      ...data,
      id: undefined,
      NID: parent?.NID,
    });

    const Patient = createPatient.toJSON();

    return Patient;
  }

  public static async update(
    id: string,
    data: IPatientRequest
  ): Promise<boolean> {
    const patientWithNID = await PatientsModel.findOne({
      where: { NID: data.NID, id: { [Op.ne]: id } },
    });
    if (patientWithNID)
      throw new CustomError(
        "Patient with same NID exists. Use add dependant instead",
        409
      );
    try {
      await PatientsModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async delete(id: string): Promise<number> {
    return await PatientsModel.destroy({ where: { id: id } });
  }
}

export default PatientService;
