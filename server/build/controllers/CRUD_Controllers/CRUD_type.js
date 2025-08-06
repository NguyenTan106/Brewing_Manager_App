"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteType = exports.handleCreateType = exports.handleGetAllTypes = void 0;
const CRUD_ingredient_service_1 = require("../../prisma/CRUD_Services/CRUD_ingredient_service");
const schema_1 = require("../../middlewares/schema");
const handleGetAllTypes = async (req, res) => {
    try {
        const data = await (0, CRUD_ingredient_service_1.getAllTypes)();
        res.status(200).json(data);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllTypes:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm các loại nguyên liệu",
        });
    }
};
exports.handleGetAllTypes = handleGetAllTypes;
const handleCreateType = async (req, res) => {
    try {
        const parsed = schema_1.typeSchema.parse(req.body);
        const result = await (0, CRUD_ingredient_service_1.createType)(parsed.typeName);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handleCreateType:", e);
        res.status(500).json({
            message: "Lỗi server khi thêm loại nguyên liệu",
        });
    }
};
exports.handleCreateType = handleCreateType;
const handleDeleteType = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await (0, CRUD_ingredient_service_1.deleteType)(id);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("Lỗi trong controller handleDeleteType:", e);
        res.status(500).json({
            message: "Lỗi server khi xóa loại nguyên liệu",
        });
    }
};
exports.handleDeleteType = handleDeleteType;
