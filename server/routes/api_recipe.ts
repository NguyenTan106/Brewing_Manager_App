import express from "express";
const router = express.Router();

import {
  handleGetAllRecipes,
  handleCreateRecipe,
  handleGetRecipeById,
  handleUpdateRecipeById,
  handleDeleteRecipeById,
} from "../controllers/CRUD_Controllers/CRUD_recipe";
import { handlePaginationRecipe } from "../controllers/pagination";
import {
  handleGetTotalRecipes,
  handleGetTotalRecipesMostUsed,
  handleGetTotalRecipesRecentlyUpdated,
} from "../controllers/Report_Controllers/statistic_recipe_controler";
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

const getTotalRecipesController = router.get(
  "/total-recipes",
  handleGetTotalRecipes
);
const getTotalRecipesMostUsedController = router.get(
  "/total-recipes-most-used",
  handleGetTotalRecipesMostUsed
);
const getTotalRecipesRecentlyUpdated = router.get(
  "/total-recipes-recently-updated",
  handleGetTotalRecipesRecentlyUpdated
);
export {
  getAllRecipesController,
  createRecipesController,
  getRecipeByIdController,
  updateRecipesByIdController,
  deleteRecipesByIdController,
  paginationRecipeAPIController,
  getTotalRecipesController,
  getTotalRecipesMostUsedController,
  getTotalRecipesRecentlyUpdated,
};
