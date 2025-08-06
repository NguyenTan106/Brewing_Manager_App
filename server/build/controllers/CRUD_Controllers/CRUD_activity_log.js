"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetActivityLogById = exports.handleGetAllActivityLogs = void 0;
const CRUD_activityLog_service_1 = require("../../prisma/CRUD_Services/CRUD_activityLog_service");
const handleGetAllActivityLogs = async (req, res) => {
    try {
        const handle = await (0, CRUD_activityLog_service_1.getAllActivityLogs)();
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetAllLogs:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm nhật kí hoạt động",
        });
    }
};
exports.handleGetAllActivityLogs = handleGetAllActivityLogs;
const handleGetActivityLogById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const handle = await (0, CRUD_activityLog_service_1.getActivityLogById)(id);
        res.status(200).json(handle);
    }
    catch (e) {
        console.error("Lỗi trong controller handleGetActivityLogById:", e);
        res.status(500).json({
            message: "Lỗi server khi tìm nhật kí hoạt động",
        });
    }
};
exports.handleGetActivityLogById = handleGetActivityLogById;
