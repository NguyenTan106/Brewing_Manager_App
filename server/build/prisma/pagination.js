"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
// src/utils/pagination.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const paginate = async ({ page, limit, model, where = {}, orderBy = { id: "asc" }, select, include, enhanceItem, useSoftDelete = false, }) => {
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
exports.paginate = paginate;
