import express from "express";
const router = express.Router();

import {
  handleGetAllRecipes,
  handleCreateRecipe,
  handleGetRecipeById,
  handleUpdateRecipeById,
  handleDeleteRecipeById,
} from "../controllers/CRUD_recipe";
import { handlePaginationRecipe } from "../controllers/pagination";

const getAllRecipesController = router.get("/recipes", handleGetAllRecipes);
const getRecipeByIdController = router.get("/recipe/:id", handleGetRecipeById);
const createRecipesController = router.post("/recipe", handleCreateRecipe);
const updateRecipesByIdController = router.put(
  "/recipe/:id",
  handleUpdateRecipeById
);
const deleteRecipesByIdController = router.delete(
  "/recipe/:id",
  handleDeleteRecipeById
);

const paginationRecipeAPIController = router.get(
  "/pagination-recipe",
  handlePaginationRecipe
);

export {
  getAllRecipesController,
  createRecipesController,
  getRecipeByIdController,
  updateRecipesByIdController,
  deleteRecipesByIdController,
  paginationRecipeAPIController,
};
