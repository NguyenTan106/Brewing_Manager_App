import express from "express";
const router = express.Router();

import {
  handleGetAllIngredients,
  handleGetAllIngredientById,
  handleCreateIngredient,
  handleUpdateIngredientById,
  handleDeleteIngredientById,
} from "../controllers/CRUD_ingredient";
import { handleGetAllTypes, handleCreateType } from "../controllers/CRUD_type";

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

const getAllTypesController = router.get("/types", handleGetAllTypes);
const createTypeController = router.post("/type", handleCreateType);

export {
  getAllIngredientsController,
  getAllIngredientByIdController,
  createIngredientController,
  updateIngredientByIdController,
  deleteIngredientByIdController,
  getAllTypesController,
  createTypeController,
};
