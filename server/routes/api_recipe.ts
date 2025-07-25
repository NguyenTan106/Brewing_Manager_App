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
  handleGetTop5RecipesMostUsed,
  handleGetTop5RecipesRecentlyUpdated,
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
const getTop5RecipesMostUsedController = router.get(
  "/top-5-recipes-most-used",
  handleGetTop5RecipesMostUsed
);
const getTop5RecipesRecentlyUpdated = router.get(
  "/top-5-recipes-recently-updated",
  handleGetTop5RecipesRecentlyUpdated
);
export {
  getAllRecipesController,
  createRecipesController,
  getRecipeByIdController,
  updateRecipesByIdController,
  deleteRecipesByIdController,
  paginationRecipeAPIController,
  getTotalRecipesController,
  getTop5RecipesMostUsedController,
  getTop5RecipesRecentlyUpdated,
};
