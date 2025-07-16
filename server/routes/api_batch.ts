import express from "express";
const router = express.Router();

import {
  handleGetAllBatches,
  handleGetBatchById,
  handleCreateBatch,
  handleDeleteBacthById,
  handleUpdateBatchById,
} from "../controllers/CRUD_batch";

import { handlePaginationBatch } from "../controllers/pagination";

const getAllBatchesController = router.get("/batches", handleGetAllBatches);
const getBatchByIdController = router.get("/batch/:id", handleGetBatchById);
const createBatchController = router.post("/batch/", handleCreateBatch);
const updateBatchByIdController = router.put(
  "/batch/:id",
  handleUpdateBatchById
);
const deleteBatchByIdController = router.delete(
  "/batch/:id",
  handleDeleteBacthById
);

const paginationBatchController = router.get(
  "/pagination-batch",
  handlePaginationBatch
);

export {
  getAllBatchesController,
  getBatchByIdController,
  createBatchController,
  deleteBatchByIdController,
  updateBatchByIdController,
  paginationBatchController
};
