import express from "express";
import {
  handleCreateNewSupplier,
  handleGetAllSuppliers,
  handleGetSupplierById,
  handleUpdateSupplierById,
  handleDeleteSupplierById,
} from "../controllers/CRUD_Controllers/CRUD_supplier";
const router = express.Router();

const createNewSupplierController = router.post(
  "/supplier",
  handleCreateNewSupplier
);

const getAllSuppliersController = router.get(
  "/suppliers",
  handleGetAllSuppliers
);

const getSupplierByIdController = router.get(
  "/supplier/:id",
  handleGetSupplierById
);

const updateSupplierByIdController = router.put(
  "/supplier/:id",
  handleUpdateSupplierById
);

const deleteSupplierByIdController = router.delete(
  "/supplier/:id",
  handleDeleteSupplierById
);

export {
  createNewSupplierController,
  getAllSuppliersController,
  getSupplierByIdController,
  updateSupplierByIdController,
  deleteSupplierByIdController,
};
