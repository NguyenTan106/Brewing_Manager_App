"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteRecipeById = exports.handleUpdateRecipeById = exports.handleGetRecipeById = exports.handleCreateRecipe = exports.handleGetAllRecipes = void 0;
const logActivityService_1 = require("../../services/logActivityService");
const logActivity_1 = require("../../prisma/logActivity");
const CRUD_recipe_service_1 = require("../../prisma/CRUD_Services/CRUD_recipe_service");
const schema_1 = require("../../middlewares/schema");
const handleGetAllRecipes = async (req, res) => {
    try {
        const handle = await (0, CRUD_recipe_service_1.getAllRecipes)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllBatches:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm công thức",
        });
    }
};
exports.handleGetAllRecipes = handleGetAllRecipes;
const handleGetRecipeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const handle = await (0, CRUD_recipe_service_1.getRecipeById)(id);
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetRecipeById:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm công thức",
        });
    }
};
exports.handleGetRecipeById = handleGetRecipeById;
const handleCreateRecipe = async (req, res) => {
    try {
        // ✅ Validate toàn bộ schema (bao gồm cả recipeSteps)
        const parsed = schema_1.recipeSchema.parse(req.body);
        const handle = await (0, CRUD_recipe_service_1.createRecipe)(parsed.name, parsed.recipeIngredients, parsed.steps, parsed.createdById, parsed.description, parsed.note, parsed.instructions);
        const data = handle.data;
        // ✅ Trả JSON trước (khuyến khích để tránh lỗi log chặn response)
        res.status(200).json(handle);
        // ✅ Sau đó ghi log (không block response)
        const logCreatedAt = new Date(data.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        await (0, logActivity_1.logActivity)("create", "Recipe", data.id, `${data.createdBy.username} đã thêm công thức "${data.name}" vào ${logCreatedAt}`);
    }
    catch (e) {
        console.error("Lỗi trong controller handleCreateRecipe:", e);
        res.status(500).json({
            message: "Lỗi server khi tạo công thức",
        });
    }
};
exports.handleCreateRecipe = handleCreateRecipe;
const handleUpdateRecipeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const oldResult = await (0, CRUD_recipe_service_1.getRecipeById)(id);
        const parsed = schema_1.recipeUpdateSchema.parse(req.body);
        const result = await (0, CRUD_recipe_service_1.updateRecipeById)(id, parsed.name, parsed.description, parsed.note, parsed.instructions, parsed.recipeIngredients, parsed.steps);
        const newData = result.data;
        const oldData = oldResult.data;
        // 🔍 Kiểm tra trước khi gọi log
        if (newData.id || newData.length != 0) {
            await (0, logActivityService_1.compareAndLogChanges)(oldData, newData, [
                "name",
                "description",
                "notes",
                "instructions",
                "recipeIngredients",
                "steps",
            ], "Recipe", newData.id, oldData.name
            // userId // nếu cần
            );
            res.status(200).json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (e) {
        console.error("Lỗi trong controller handleUpdateRecipeById:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhật công thức",
        });
    }
};
exports.handleUpdateRecipeById = handleUpdateRecipeById;
const handleDeleteRecipeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const logDeleteDate = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const deleted = await (0, CRUD_recipe_service_1.deleteRecipeById)(id);
        res.status(200).json(deleted);
        const data = deleted.data;
        await (0, logActivity_1.logActivity)("delete", "Recipe", data.id, `Xóa công thức ${data.id}: "${data.name}" vào ngày ${logDeleteDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleDeleteRecipeById:", e);
        res.status(500).json({
            message: "Lỗi server khi xóa công thức",
        });
    }
};
exports.handleDeleteRecipeById = handleDeleteRecipeById;
