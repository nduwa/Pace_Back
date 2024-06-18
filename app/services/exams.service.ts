import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { Paged } from "../type";
import { IExam, IExamRequest } from "../type/exams";
import ExamModel from "../database/models/ExamModel";

class ExamService {
  public static async getOne(id: string): Promise<IExam | null> {
    return (await ExamModel.findByPk(id)) as unknown as IExam;
  }

  public static async getAll(
    limit: number,
    offset: number,
    searchq: string | undefined
  ): Promise<Paged<IExam[]>> {
    let queryOptions = QueryOptions(["name", "exam_code", "name"], searchq);

    const data = await ExamModel.findAll({
      where: {
        ...queryOptions,
      },
      ...TimestampsNOrder,

      limit,
      offset,
    });

    const totalItems = await ExamModel.count({
      where: {
        ...queryOptions,
      },
    });
    return { data, totalItems };
  }

  public static async create(data: IExamRequest): Promise<IExam> {
    const [exam] = await ExamModel.findOrCreate({
      where: { name: data.name },
      defaults: { ...data },
    });

    return exam.toJSON();
  }

  public static async update(id: string, data: IExamRequest): Promise<boolean> {
    try {
      await ExamModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await ExamModel.destroy({ where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }

  public static async getByType(name: string): Promise<IExam[]> {
    const data = await ExamModel.findAll({ where: { Exam: name } });
    return data as unknown as IExam[];
  }

  public static async getNPaged(): Promise<IExam[]> {
    const data = await ExamModel.findAll();
    return data as unknown as IExam[];
  }
}

export default ExamService;
