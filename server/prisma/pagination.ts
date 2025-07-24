// src/utils/pagination.ts
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

interface PaginationOptions<T> {
  page: number;
  limit: number;
  model: keyof PrismaClient;
  where?: Prisma.Enumerable<any>;
  orderBy?: Prisma.Enumerable<any>;
  select?: Prisma.Enumerable<any>;
  include?: Prisma.Enumerable<any>;
  enhanceItem?: (item: any) => Promise<T>;
}

export const paginate = async <T = any>({
  page,
  limit,
  model,
  where,
  orderBy = { id: "asc" },
  select,
  include,
  enhanceItem,
}: PaginationOptions<T>) => {
  const skip = (page - 1) * limit;

  // @ts-ignore: Truy cập động vào model
  const total = await prisma[model].count();

  // @ts-ignore
  const items = await prisma[model].findMany({
    skip,
    take: limit,
    where,
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
