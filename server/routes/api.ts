import express from "express";
const router = express.Router();

import {
  handleGetAllIngredients,
  handleGetAllIngredientById,
  handleCreateIngredient,
  handleUpdateIngredientById,
  handleDeleteIngredientById,
} from "../controllers/CRUD_ingredient";

import { checkInventory } from "../controllers/checkInventory";

const getAllIngredientsController = router.get(
  "/ingredients",
  handleGetAllIngredients
);

const getAllIngredientByIdController = router.get(
  "/ingredient/:id",
  handleGetAllIngredientById
);

const createIngredientController = router.post(
  "/ingredient",
  handleCreateIngredient
);

const updateIngredientByIdController = router.put(
  "/ingredient/:id",
  handleUpdateIngredientById
);

const deleteIngredientByIdController = router.delete(
  "/ingredient/:id",
  handleDeleteIngredientById
);

const checkInventoryController = router.post(
  "/check-inventory",
  checkInventory
);

export {
  getAllIngredientsController,
  getAllIngredientByIdController,
  createIngredientController,
  updateIngredientByIdController,
  deleteIngredientByIdController,
  checkInventoryController,
};
