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

export const DatesOpt = (
  startDate: string | undefined,
  endDate: string | undefined
) => {
  let endDateStr = endDate;
  if (startDate && endDate && startDate == endDate) {
    endDateStr = undefined;
  }
  if (endDateStr) {
    const date = new Date(endDateStr);

    // Adding one day
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Formatting to yyyy-mm-dd
    endDateStr = nextDay.toISOString().split("T")[0];
  }

  return {
    [Op.and]: [
      startDate ? { createdAt: { [Op.gte]: startDate } } : {},
      endDateStr ? { createdAt: { [Op.lte]: endDateStr } } : {},
    ],
  };
};
