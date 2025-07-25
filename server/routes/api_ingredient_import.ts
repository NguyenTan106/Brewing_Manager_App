import express from "express";
const router = express.Router();

import { handleImportIngredientById } from "../controllers/CRUD_Controllers/CRUD_ingredient_import";

const importIngredientByIdController = router.post(
  "/ingredient-imports",
  handleImportIngredientById
);

export { importIngredientByIdController };
