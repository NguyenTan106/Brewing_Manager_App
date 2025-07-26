import express from "express";
const router = express.Router();

import {
  searchIngredient,
  searchBatch,
  searchRecipe,
} from "../controllers/search_IF-IDF";
const searchIngredientController = router.post(
  "/search-ingredient",
  searchIngredient
);
const searchBatchController = router.post("/search-batch", searchBatch);

const searchRecipeController = router.post("/search-recipe", searchRecipe);

export {
  searchIngredientController,
  searchBatchController,
  searchRecipeController,
};
