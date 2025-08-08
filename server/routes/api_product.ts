import express from "express";
import {
  handleCreateNewProduct,
  handleGetAllProducts,
  handleGetProductById,
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

export {
  createNewProductController,
  getAllProductsController,
  getProductByIdController,
};
