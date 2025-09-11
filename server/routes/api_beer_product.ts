import express from "express";
import {
  handleCreateNewBeerProduct,
  handleGetAllBeerProducts,
  handleGetBeerProductById,
  handleUpdateBeerProductById,
  handleDeleteBeerProductById,
} from "../controllers/CRUD_Controllers/CRUD_beer_product";
import { handleGetTotalBeerProducts } from "../controllers/Report_Controllers/statistic_beer_product_controller";
const router = express.Router();

const createNewBeerProductController = router.post(
  "/beer-product",
  handleCreateNewBeerProduct
);

const getAllBeerProductsController = router.get(
  "/beer-products",
  handleGetAllBeerProducts
);

const getBeerProductByIdController = router.get(
  "/beer-product/:id",
  handleGetBeerProductById
);

const updateBeerProductByIdController = router.put(
  "/beer-product/:id",
  handleUpdateBeerProductById
);

const deleteBeerProductByIdController = router.delete(
  "/beer-product/:id",
  handleDeleteBeerProductById
);

const getTotalBeerProductsController = router.get(
  "/total-beer-products",
  handleGetTotalBeerProducts
);

export {
  createNewBeerProductController,
  getAllBeerProductsController,
  getBeerProductByIdController,
  updateBeerProductByIdController,
  deleteBeerProductByIdController,
  getTotalBeerProductsController,
};
