import express from "express";
const router = express.Router();

import { handleGetAllActivityLogs } from "../controllers/CRUD_activity_log";

const getAllActivityLogsController = router.get(
  "/activity-logs",
  handleGetAllActivityLogs
);

export { getAllActivityLogsController };
