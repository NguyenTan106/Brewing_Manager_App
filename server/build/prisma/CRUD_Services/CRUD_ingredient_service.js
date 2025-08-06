"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIngredientCost = exports.getIngredientPage = exports.deleteType = exports.createType = exports.getAllTypes = exports.deleteIngredientById = exports.updateIngredientById = exports.createIngredient = exports.getIngredientById = exports.getAllIngredients = exports.getIngredientStatus = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = require("../pagination");
const prisma = new client_1.PrismaClient();
// use `prisma` in your application to read and write data in your DB
const getIngredientStatus = async (quantity, threshold) => {
    if (quantity <= 0)
        return "Hết";
    if (quantity <= threshold)
        return "Sắp hết";
    return "Đủ";
};
exports.getIngredientStatus = getIngredientStatus;
// CRUD ingredient
const getAllIngredients = async () => {
    try {
        const data = await prisma.ingredient.findMany({
            orderBy: {
                id: "asc", // hoặc "desc" cho giảm dần
            },
            where: {
                isDeleted: false,
            },
        });
        if (data.length === 0) {
            return { message: "Chưa có nguyên liệu nào", data: [] };
        }
        const result = await Promise.all(data.map(async (i) => {
            const latestCost = await prisma.ingredientCostHistory.findFirst({
                where: { ingredientId: i.id },
                orderBy: { createdAt: "desc" },
                select: { cost: true },
            });
            return {
                ...i,
                cost: latestCost?.cost ?? null,
                status: await (0, exports.getIngredientStatus)(i.quantity, i.lowStockThreshold),
            };
        }));
        return {
            message: "Thành công",
            data: result,
        };
    }
    catch (e) {
        console.error(e);
        throw new Error("Lỗi khi truy vấn nguyên liệu");
    }
};
exports.getAllIngredients = getAllIngredients;
const getIngredientById = async (id) => {
    try {
        const data = await prisma.ingredient.findUnique({
            where: { id: id, isDeleted: false },
        });
        if (!data) {
            return { message: "Không tìm thấy nguyên liệu", data: [] };
        }
        const latestCost = await prisma.ingredientCostHistory.findFirst({
            where: { ingredientId: id },
            orderBy: { createdAt: "desc" },
            select: { cost: true },
        });
        const allCost = await prisma.ingredientCostHistory.findMany({
            where: { ingredientId: data.id },
        });
        const result = {
            ...data,
            cost: latestCost?.cost ?? null,
            allCost: allCost,
            status: await (0, exports.getIngredientStatus)(data.quantity, data.lowStockThreshold),
        };
        return {
            message: "Thành công",
            data: result,
        };
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
exports.getIngredientById = getIngredientById;
const createIngredientCost = async (ingredientId, cost, note) => {
    try {
        if (!ingredientId || cost <= 0) {
            throw new Error("Dữ liệu không hợp lệ");
        }
        const newCost = await prisma.ingredientCostHistory.create({
            data: {
                ingredientId: Number(ingredientId),
                cost: Number(cost),
                note,
            },
        });
        return {
            message: "Thêm giá nhập mới thành công",
            data: newCost,
        };
    }
    catch (e) {
        console.error("Lỗi khi tạo giá nhập mới:", e);
        throw new Error("Không thể thêm giá nhập mới");
    }
};
exports.createIngredientCost = createIngredientCost;
const createIngredient = async (name, type, unit, quantity, lowStockThreshold, lastImportDate, notes) => {
    try {
        // ✅ Kiểm tra trùng tên
        const existing = await prisma.ingredient.findUnique({
            where: {
                name: name,
            },
        });
        const vnNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
        if (existing) {
            return {
                message: `Nguyên liệu ${name} đã tồn tại`,
                data: null,
            };
        }
        // ✅ Tạo nguyên liệu mới nếu không trùng
        const data = await prisma.ingredient.create({
            data: {
                name,
                type,
                unit,
                quantity: Number(quantity),
                lowStockThreshold: Number(lowStockThreshold),
                lastImportDate: vnNow,
                notes,
            },
        });
        return {
            message: "Thêm nguyên liệu thành công",
            data,
        };
    }
    catch (e) {
        console.error("Lỗi khi tạo nguyên liệu:", e);
        throw new Error("Không thể thêm nguyên liệu");
    }
};
exports.createIngredient = createIngredient;
const updateIngredientById = async (id, updateData) => {
    try {
        const existing = await prisma.ingredient.findUnique({
            where: { id, isDeleted: false },
        });
        if (!existing) {
            return {
                message: `Không tìm thấy nguyên liệu với ID = ${id}`,
                data: null,
            };
        }
        const updated = await prisma.ingredient.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date(), // cập nhật thủ công nếu không dùng @updatedAt
            },
        });
        return {
            message: "Cập nhật nguyên liệu thành công",
            data: updated,
        };
    }
    catch (e) {
        console.error("Lỗi khi cập nhật nguyên liệu:", e);
        throw new Error("Không thể cập nhật nguyên liệu");
    }
};
exports.updateIngredientById = updateIngredientById;
const deleteIngredientById = async (id) => {
    try {
        const existing = await prisma.ingredient.findUnique({ where: { id } });
        if (!existing) {
            return {
                message: `Không tìm thấy nguyên liệu với ID = ${id}`,
                data: null,
            };
        }
        const deleted = await prisma.ingredient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
        return {
            message: "Xóa nguyên liệu thành công",
            data: deleted,
        };
    }
    catch (e) {
        console.error("Lỗi khi xóa nguyên liệu:", e);
        throw new Error("Không thể xóa nguyên liệu");
    }
};
exports.deleteIngredientById = deleteIngredientById;
// CRUD type
const getAllTypes = async () => {
    try {
        const data = await prisma.type.findMany();
        if (data.length === 0) {
            return { message: "Chưa có loại nào", data: [] };
        }
        return {
            message: "Thành công",
            data: data,
        };
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
exports.getAllTypes = getAllTypes;
const createType = async (typeName) => {
    try {
        // ✅ Kiểm tra trùng tên
        const existing = await prisma.type.findUnique({
            where: {
                typeName: typeName, // shorthand, tương đương typeName: typeName
            },
        });
        if (existing) {
            return {
                message: `Loại nguyên liệu ${typeName} đã tồn tại`,
                data: null,
            };
        }
        // ✅ Tạo nguyên liệu mới nếu không trùng
        const data = await prisma.type.create({
            data: {
                typeName,
            },
        });
        return {
            message: "Thêm loại nguyên liệu thành công",
            data,
        };
    }
    catch (e) {
        console.error("Lỗi khi tạo loại nguyên liệu:", e);
        throw new Error("Không thể thêm loai nguyên liệu");
    }
};
exports.createType = createType;
const deleteType = async (id) => {
    try {
        const existing = await prisma.type.findUnique({ where: { id: id } });
        if (!existing) {
            return {
                message: `Không tìm thấy loại nguyên liệu với ID = ${id}`,
                data: null,
            };
        }
        const deleted = await prisma.type.delete({
            where: { id },
        });
        return {
            message: "Xóa loại nguyên liệu thành công",
            data: deleted,
        };
    }
    catch (e) {
        console.error("Lỗi khi xóa loại nguyên liệu:", e);
        throw new Error("Không thể xóa loại nguyên liệu");
    }
};
exports.deleteType = deleteType;
const getIngredientPage = async (page, limit) => {
    return (0, pagination_1.paginate)({
        page,
        limit,
        model: "ingredient",
        where: { isDeleted: false },
        orderBy: { id: "asc" },
        enhanceItem: async (i) => {
            const latestCost = await prisma.ingredientCostHistory.findFirst({
                where: { ingredientId: i.id },
                orderBy: { createdAt: "desc" },
                select: { cost: true },
            });
            return {
                ...i,
                cost: latestCost?.cost ?? null,
                status: await (0, exports.getIngredientStatus)(i.quantity, i.lowStockThreshold),
            };
        },
        useSoftDelete: true,
    });
};
exports.getIngredientPage = getIngredientPage;
