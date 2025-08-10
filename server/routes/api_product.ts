import express from "express";
import {
  handleCreateNewProduct,
  handleGetAllProducts,
  handleGetProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} from "../controllers/CRUD_Controllers/CRUD_product";
const router = express.Router();

const createNewProductController = router.post(
  "/product",
  handleCreateNewProduct
);

const getAllProductsController = router.get("/products", handleGetAllProducts);

const getProductByIdController = router.get(
  "/product/:id",
  handleGetProductById
);

const updateProductByIdController = router.put(
  "/product/:id",
  handleUpdateProductById
);
const deleteProductByIdController = router.delete(
  "/product/:id",
  handleDeleteProductById
);

export {
  createNewProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductByIdController,
  deleteProductByIdController,
};
