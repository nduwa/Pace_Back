import { Op, Order } from "sequelize";

export const QueryOptions = (
  columns: string[],
  searchq: string | undefined
) => {
  let queryOptions: { [key: string]: any } = searchq
    ? {
        [Op.or]: columns.map((column) => {
          return { [column]: { [Op.iLike]: `%${searchq}%` } };
        }),
      }
    : {};

  return queryOptions;
};

export const TimestampsNOrder = {
  attributes: { exclude: ["deletedAt", "updatedAt"] },
  order: [["createdAt", "DESC"]] as unknown as Order,
};

export const Paginations = (
  currentPage: number | undefined,
  limit: number | undefined
) => {
  const page = currentPage || 1;
  const pageSize = limit || 15;
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
};
