"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredientStockStatus = exports.getTotalIngredients = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTotalIngredients = async () => {
    try {
        const total = await prisma.ingredient.count({
            where: { isDeleted: false },
        });
        if (total === 0) {
            return { message: "Chưa có nguyên liệu nào được tạo", data: 0 };
        }
        return {
            message: "Thành công",
            data: total,
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
        throw new Error("Lỗi server khi tính tổng nguyên liệu");
    }
};
exports.getTotalIngredients = getTotalIngredients;
const getIngredientStockStatus = async () => {
    try {
        const outOfStock = await prisma.ingredient.count({
            where: {
                quantity: 0,
                isDeleted: false,
            },
        });
        const lowStock = await prisma.ingredient.count({
            where: {
                quantity: {
                    gt: 0,
                    lte: prisma.ingredient.fields.lowStockThreshold,
                },
                isDeleted: false,
            },
        });
        return {
            message: "Thành công",
            data: {
                outOfStock,
                lowStock,
            },
        };
    }
    catch (error) {
        console.error("Lỗi khi lấy tình trạng kho nguyên liệu:", error);
        throw new Error("Lỗi server khi thống kê nguyên liệu sắp hết / đã hết");
    }
};
exports.getIngredientStockStatus = getIngredientStockStatus;
