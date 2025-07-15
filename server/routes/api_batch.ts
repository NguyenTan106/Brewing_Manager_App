import express from "express";
const router = express.Router();

import {
  handleGetAllBatches,
  handleGetBatchById,
} from "../controllers/CRUD_batch";

const getAllBatchesController = router.get("/batches", handleGetAllBatches);
const getBatchByIdController = router.get("/batch/:id", handleGetBatchById);

export { getAllBatchesController, getBatchByIdController };
