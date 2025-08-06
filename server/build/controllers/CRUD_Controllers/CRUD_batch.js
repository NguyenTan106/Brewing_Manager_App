"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCancelBacthById = exports.handleGetBatchStepById = exports.handleUpdateFeedbackBatchStep = exports.handleUpdateBatchById = exports.handleDeleteBacthById = exports.handleCreateBatch = exports.handleGetBatchById = exports.handleGetAllBatches = void 0;
const zod_1 = require("zod");
const logActivityService_1 = require("../../services/logActivityService");
const CRUD_batch_service_1 = require("../../prisma/CRUD_Services/CRUD_batch_service");
const schema_1 = require("../../middlewares/schema");
const logActivity_1 = require("../../prisma/logActivity");
const handleGetAllBatches = async (req, res) => {
    try {
        const handle = await (0, CRUD_batch_service_1.getAllBatches)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllBatchs:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm mẻ",
        });
    }
};
exports.handleGetAllBatches = handleGetAllBatches;
const handleGetBatchById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const handle = await (0, CRUD_batch_service_1.getBatchById)(id);
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetBatchById:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm mẻ",
        });
    }
};
exports.handleGetBatchById = handleGetBatchById;
const handleGetBatchStepById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const handle = await (0, CRUD_batch_service_1.getBatchStepById)(id);
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetBatchStepById:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm các bước nấu",
        });
    }
};
exports.handleGetBatchStepById = handleGetBatchStepById;
const handleCreateBatch = async (req, res) => {
    try {
        const parsed = schema_1.batchSchema.parse(req.body);
        const result = await (0, CRUD_batch_service_1.createBatch)(parsed.beerName, Number(parsed.volume), parsed.notes || "", Number(parsed.recipeId), Number(parsed.createdById));
        const data = result.data;
        res.status(201).json(result);
        if (data.length === 0) {
            return "Mẻ đang chưa được tạo";
        }
        const logCreatedAt = new Date(data.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        await (0, logActivity_1.logActivity)("create", "Batch", data.id, `Thêm mẻ "${data.beerName}": ${data.volume}L với trạng thái ${data.status} bởi ${data.createdBy.username} vào ngày ${logCreatedAt}`
        // userId // nếu có
        );
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            const errMessage = e._zod.def;
            const err = errMessage.map((e) => e.message);
            console.error("Lỗi trong controller handleCreateBatch:", err.toString());
            res.status(500).json({
                message: err.toString(),
            });
        }
    }
};
exports.handleCreateBatch = handleCreateBatch;
const handleUpdateBatchById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { beerName, notes } = req.body;
        const oldResult = await (0, CRUD_batch_service_1.getBatchById)(Number(id));
        const result = await (0, CRUD_batch_service_1.updateBatchById)(id, {
            beerName: beerName,
            notes: notes,
        });
        const oldData = oldResult.data;
        const newData = result.data;
        res.status(200).json(result);
        await (0, logActivityService_1.compareAndLogChanges)(oldData, newData, ["beerName", "volume", "notes", "recipeId"], "Batch", newData.id, oldData.beerName
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleUpdateBatchById:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhật mẻ",
        });
    }
};
exports.handleUpdateBatchById = handleUpdateBatchById;
const handleDeleteBacthById = async (req, res) => {
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
        const deleted = await (0, CRUD_batch_service_1.deleteBacthById)(id);
        res.status(200).json(deleted);
        const data = deleted.data;
        await (0, logActivity_1.logActivity)("delete", "Batch", data.id, `Xóa mẻ ${data.code}: "${data.beerName}": ${data.volume}L vào ngày ${logDeleteDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleDeleteBacthById:", e);
        res.status(500).json({
            message: "Lỗi server khi xóa mẻ",
        });
    }
};
exports.handleDeleteBacthById = handleDeleteBacthById;
const handleCancelBacthById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const logCancelledDate = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const cancelled = await (0, CRUD_batch_service_1.cancelBatchById)(id);
        res.status(200).json(cancelled);
        const data = cancelled.data;
        await (0, logActivity_1.logActivity)("cancel", "Batch", data.id, `Hủy mẻ ${data.code}: "${data.beerName}": ${data.volume}L vào ngày ${logCancelledDate}`
        // userId // nếu có
        );
    }
    catch (e) {
        console.error("Lỗi trong controller handleCancelBacthById:", e);
        res.status(500).json({
            message: "Lỗi server khi hủy mẻ",
        });
    }
};
exports.handleCancelBacthById = handleCancelBacthById;
const handleUpdateFeedbackBatchStep = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updateData = req.body;
        const updated = await (0, CRUD_batch_service_1.updateFeedbackBatchStep)(id, updateData);
        res.status(200).json(updated);
    }
    catch (e) {
        console.error("Lỗi trong controller handleUpdateFeedbackBatchSteps:", e);
        res.status(500).json({
            message: "Lỗi server khi cập nhật feedback",
        });
    }
};
exports.handleUpdateFeedbackBatchStep = handleUpdateFeedbackBatchStep;
