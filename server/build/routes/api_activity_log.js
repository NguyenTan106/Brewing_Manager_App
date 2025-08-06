"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogByIdController = exports.paginationActivityLogController = exports.getAllActivityLogsController = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const CRUD_activity_log_1 = require("../controllers/CRUD_Controllers/CRUD_activity_log");
const pagination_1 = require("../controllers/pagination");
const getAllActivityLogsController = router.get("/activity-logs", CRUD_activity_log_1.handleGetAllActivityLogs);
exports.getAllActivityLogsController = getAllActivityLogsController;
const getActivityLogByIdController = router.get("/activity-log/:id", CRUD_activity_log_1.handleGetActivityLogById);
exports.getActivityLogByIdController = getActivityLogByIdController;
const paginationActivityLogController = router.get("/pagination-activity-log", pagination_1.handlePaginationActivityLog);
exports.paginationActivityLogController = paginationActivityLogController;
