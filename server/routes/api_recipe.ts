import express from "express";
const router = express.Router();

import {
  handleGetAllRecipes,
  handleCreateRecipe,
  handleGetRecipeById,
  handleUpdateRecipeById,
  handleDeleteRecipeById,
} from "../controllers/CRUD_recipe";

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

export {
  getAllRecipesController,
  createRecipesController,
  getRecipeByIdController,
  updateRecipesByIdController,
  deleteRecipesByIdController,
};
