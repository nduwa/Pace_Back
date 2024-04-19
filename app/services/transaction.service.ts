import { Op, Sequelize } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import { Paged } from "../type";
import Transactions from "../database/models/Transactions";
import {
  ITransaction,
  ITransactionDTO,
  ITransactionRequest,
} from "../type/instutution";

class TransactionService {
  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    searchq: string | undefined,
    type: string | undefined
  ): Promise<Paged<Transactions[]>> {
    let queryOptions = QueryOptions(["type", "reason"], searchq);

    const institutionOpt = {
      institutionId: institutionId,
    };

    const typeOpt = type && type !== "all" ? { type: type } : {};

    queryOptions = {
      ...queryOptions,
      ...institutionOpt,
      ...typeOpt,
    };

    const data = await Transactions.findAll({
      include: ["user", "institution"],
      where: queryOptions,
      ...TimestampsNOrder,
      limit,
      offset,
    });

    const totalItems = await Transactions.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }

  public static async getOne(id: string): Promise<ITransactionDTO> {
    const transaction = await Transactions.findByPk(id, {
      include: ["institution", "user"],
    });

    return transaction as unknown as ITransactionDTO;
  }

  public static async getAllNPaged(
    institutionId: string | null
  ): Promise<ITransactionDTO[]> {
    const transactions = await Transactions.findAll({
      where: {
        [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
      },
      include: ["institution", "user"],
    });

    return transactions as unknown as ITransactionDTO[];
  }

  public static async create(
    userId: string,
    institutionId: string | null,
    data: ITransactionRequest
  ): Promise<ITransaction> {
    const createTransaction = await Transactions.create({
      ...data,
      institutionId,
      userId,
    });
    const transaction = createTransaction.toJSON();

    return transaction;
  }

  public static async update(
    id: string,
    data: ITransactionRequest
  ): Promise<boolean> {
    try {
      await Transactions.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async delete(id: string): Promise<number> {
    return await Transactions.destroy({ where: { id: id } });
  }
}

export default TransactionService;
