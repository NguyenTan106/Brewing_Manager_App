import express from "express";
const router = express.Router();

import {
  handleGetAllBatches,
  handleGetBatchById,
  handleCreateBatch,
  handleDeleteBacthById,
  handleUpdateBatchById,
  handleUpdateFeedbackBatchStep,
  handleGetBatchStepById,
  handleCancelBacthById,
} from "../controllers/CRUD_Controllers/CRUD_batch";

import {
  handleGetTotalBatches,
  handleGetTotalBatchesByDayWeekYear,
} from "../controllers/Report_Controllers/statistic_batch_controller";

import { handlePaginationBatch } from "../controllers/pagination";

const getAllBatchesController = router.get("/batches", handleGetAllBatches);
const getBatchByIdController = router.get("/batch/:id", handleGetBatchById);
const createBatchController = router.post("/batch/", handleCreateBatch);
const updateBatchByIdController = router.put(
  "/batch/:id",
  handleUpdateBatchById
);

const updateFeedbackBatchStepController = router.put(
  "/batch-step/:id",
  handleUpdateFeedbackBatchStep
);

const deleteBatchByIdController = router.delete(
  "/batch/:id",
  handleDeleteBacthById
);

const cancelBatchByIdController = router.put(
  "/batch-cancel/:id",
  handleCancelBacthById
);

const paginationBatchController = router.get(
  "/pagination-batch",
  handlePaginationBatch
);

const getTotalBatchesController = router.get(
  "/total-batches",
  handleGetTotalBatches
);

const getGetBatchStatsByWeekMonthYearController = router.get(
  "/total-batches-by-week-month-year",
  handleGetTotalBatchesByDayWeekYear
);

const getBatchStepByIdController = router.get(
  "/batch-step/:id",
  handleGetBatchStepById
);

export {
  getAllBatchesController,
  getBatchByIdController,
  createBatchController,
  deleteBatchByIdController,
  updateBatchByIdController,
  paginationBatchController,
  getTotalBatchesController,
  getGetBatchStatsByWeekMonthYearController,
  updateFeedbackBatchStepController,
  getBatchStepByIdController,
  cancelBatchByIdController,
};
