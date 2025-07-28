// src/utils/pagination.ts
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

interface PaginationOptions<T> {
  page: number;
  limit: number;
  model: keyof PrismaClient;
  where?: any;
  orderBy?: any;
  select?: any;
  include?: any;
  enhanceItem?: (item: any) => Promise<T>;
  useSoftDelete?: boolean; // <-- Thêm lựa chọn này
}

export const paginate = async <T = any>({
  page,
  limit,
  model,
  where = {},
  orderBy = { id: "asc" },
  select,
  include,
  enhanceItem,
  useSoftDelete = false,
}: PaginationOptions<T>) => {
  const skip = (page - 1) * limit;

  const filter = {
    ...(where || {}),
    ...(useSoftDelete ? { isDeleted: false } : {}),
  };

  // @ts-ignore
  const total = await prisma[model].count({ where: filter });

  // @ts-ignore
  const items = await prisma[model].findMany({
    skip,
    take: limit,
    where: filter,
    orderBy,
    select,
    include,
  });

  const data = enhanceItem ? await Promise.all(items.map(enhanceItem)) : items;

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
};
