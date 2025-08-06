"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateNewCost = exports.handleDeleteIngredientById = exports.handleUpdateIngredientById = exports.handleCreateIngredient = exports.handleGetAllIngredientById = exports.handleGetAllIngredients = void 0;
const zod_1 = require("zod");
const CRUD_ingredient_service_1 = require("../../prisma/CRUD_Services/CRUD_ingredient_service");
const schema_1 = require("../../middlewares/schema");
const logActivityService_1 = require("../../services/logActivityService");
const logActivity_1 = require("../../prisma/logActivity");
const handleGetAllIngredients = async (req, res) => {
    try {
        const handle = await (0, CRUD_ingredient_service_1.getAllIngredients)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllIngredients:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm nguyên liệu",
        });
    }
};
exports.handleGetAllIngredients = handleGetAllIngredients;
const handleGetAllIngredientById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const handle = await (0, CRUD_ingredient_service_1.getIngredientById)(Number(id));
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllIngredientById:", e);
        res.status(500).json({
            message: `Lỗi server khi tìm nguyên liệu có id=${id}`,
        });
    }
};
exports.handleGetAllIngredientById = handleGetAllIngredientById;
const handleCreateIngredient = async (req, res) => {
    try {
        // ✅ Validate đầu vào
        const parsed = schema_1.ingredientSchema.parse(req.body);
        const lastImportDate = new Date(parsed.lastImportDate);
        const logLastImportDate = new Date(parsed.lastImportDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const result = await (0, CRUD_ingredient_service_1.createIngredient)(parsed.name, parsed.type, parsed.unit, parsed.quantity, parsed.lowStockThreshold, lastImportDate, parsed.notes || "");
        const data = result.data;
        res.status(201).json(result);
        await (0, logActivity_1.logActivity)("create", "Ingredient", data.id, `Thêm nguyên liệu "${data.name}" với số lượng ${data.quantity} ${data.unit} vào ${logLastImportDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            const errMessage = e._zod.def;
            const err = errMessage.map((e) => e.message);
            console.error("Lỗi trong controller handleCreateIngredient:", err.toString());
            res.status(500).json({
                message: err.toString(),
            });
        }
    }
};
exports.handleCreateIngredient = handleCreateIngredient;
const handleCreateNewCost = async (req, res) => {
    try {
        const { ingredientId, cost, note } = req.body;
        const result = await (0, CRUD_ingredient_service_1.createIngredientCost)(ingredientId, cost, note);
        const data = result.data;
        const logcreatedAt = new Date(data.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        res.status(201).json(result);
        await (0, logActivity_1.logActivity)("create", "IngredientCostHistory", data.id, `Thêm giá nhập mới là ${data.cost} vào ${logcreatedAt}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleCreateNewCost:", e);
        res.status(500).json({
            message: "Lỗi server khi thêm giá nhập mới",
        });
    }
};
exports.handleCreateNewCost = handleCreateNewCost;
const handleUpdateIngredientById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, type, unit, quantity, lowStockThreshold, lastImportDate, notes, } = req.body;
        const oldResult = await (0, CRUD_ingredient_service_1.getIngredientById)(Number(id));
        const result = await (0, CRUD_ingredient_service_1.updateIngredientById)(id, {
            name: name,
            type: type,
            unit: unit,
            quantity: Number(quantity),
            lowStockThreshold: Number(lowStockThreshold),
            lastImportDate: lastImportDate,
            notes: notes,
        });
        const newData = result.data;
        const oldData = oldResult.data;
        res.status(200).json(result);
        await (0, logActivityService_1.compareAndLogChanges)(oldData, newData, [
            "name",
            "type",
            "unit",
            "quantity",
            "lowStockThreshold",
            "lastImportDate",
            "notes",
        ], "Ingredient", newData.id, oldData.name
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleUpdateIngredientById:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhật nguyên liệu",
        });
    }
};
exports.handleUpdateIngredientById = handleUpdateIngredientById;
const handleDeleteIngredientById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const logDeleteDate = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const result = await (0, CRUD_ingredient_service_1.deleteIngredientById)(id);
        res.status(200).json(result);
        const data = result.data;
        await (0, logActivity_1.logActivity)("delete", "Ingredient", data.id, `Xóa nguyên liệu ${data.id}: "${data.name}" vào ${logDeleteDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleDeleteIngredientById:", e);
        res.status(500).json({
            message: "Lỗi server khi xóa nguyên liệu",
        });
    }
};
exports.handleDeleteIngredientById = handleDeleteIngredientById;
