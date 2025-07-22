import express from "express";
const router = express.Router();

import {
  handleGetAllActivityLogs,
  handleGetActivityLogById,
} from "../controllers/CRUD_activity_log";
import { handlePaginationActivityLog } from "../controllers/pagination";
const getAllActivityLogsController = router.get(
  "/activity-logs",
  handleGetAllActivityLogs
);

const getActivityLogByIdController = router.get(
  "/activity-log/:id",
  handleGetActivityLogById
);

const paginationActivityLogController = router.get(
  "/pagination-activity-log",
  handlePaginationActivityLog
);

export {
  getAllActivityLogsController,
  paginationActivityLogController,
  getActivityLogByIdController,
};
