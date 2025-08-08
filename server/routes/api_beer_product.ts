import express from "express";
import {
  handleCreateNewBeerProduct,
  handleGetAllBeerProducts,
  handleGetBeerProductById,
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

export {
  createNewBeerProductController,
  getAllBeerProductsController,
  getBeerProductByIdController,
};
