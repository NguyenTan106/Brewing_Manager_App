"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImportIngredientById = void 0;
const CRUD_ingredientImport_service_1 = require("../../prisma/CRUD_Services/CRUD_ingredientImport_service");
const logActivity_1 = require("../../prisma/logActivity");
const schema_1 = require("../../middlewares/schema");
const handleImportIngredientById = async (req, res) => {
    try {
        const parsed = schema_1.ingredientImportSchema.parse(req.body);
        const handle = await (0, CRUD_ingredientImport_service_1.importIngredient)({
            ingredientId: Number(parsed.ingredientId),
            amount: Number(parsed.amount),
            totalCost: Number(parsed.totalCost),
            notes: parsed.notes || null,
            createdById: Number(parsed.createdById),
        });
        res.status(200).json(handle);
        const data = handle.data;
        const logLastImportDate = new Date(data.updatedAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        await (0, logActivity_1.logActivity)("create", "Ingredient Import", data.id, `${data.createdBy.username} đã nhập kho nguyên liệu "${data.ingredient.name}" với số lượng ${data.amount} ${data.ingredient.unit} vào ${logLastImportDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleImportIngredientById:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhập kho nguyên liệu",
        });
    }
};
exports.handleImportIngredientById = handleImportIngredientById;
