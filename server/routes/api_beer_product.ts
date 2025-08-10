import express from "express";
import {
  handleCreateNewBeerProduct,
  handleGetAllBeerProducts,
  handleGetBeerProductById,
  handleUpdateBeerProductById,
  handleDeleteBeerProductById,
} from "../controllers/CRUD_Controllers/CRUD_beer_product";
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
export {
  createNewBeerProductController,
  getAllBeerProductsController,
  getBeerProductByIdController,
  updateBeerProductByIdController,
  deleteBeerProductByIdController,
};
